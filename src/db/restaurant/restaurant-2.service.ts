import dotenv from 'dotenv';
import { DataSource, Repository } from 'typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantDailyFeed } from './entities/restaurantDailyFeed.entity';
import {
  CreateRestaurantData,
  RestaurantFilterOptions,
  RestaurantServiceConfig,
  UpdateRestaurantData,
} from './restaurant.type';
import {
  DEFAULT_LIMIT,
  DEFAULT_RADIUS_KM,
  MAX_SEARCH_RADIUS,
} from 'src/config';
import cron from 'node-cron';
import restaurantData from './seed';
import { injectable } from 'tsyringe';
import { PaginatedResponse, paginateResponse } from 'src/utils/pagination';

dotenv.config();

@injectable()
export class RestaurantService {
  private restaurantRepository: Repository<Restaurant>;
  private dailyFeedRepository: Repository<RestaurantDailyFeed>;
  private readonly config: Required<RestaurantServiceConfig>;
  private readonly defaultConfig: Required<RestaurantServiceConfig> = {
    connectionString: process.env.DATABASE_URL || '',
    maxSearchRadius: MAX_SEARCH_RADIUS,
    defaultLimit: DEFAULT_LIMIT,
  };

  constructor(
    private readonly dataSource: DataSource,
    config: RestaurantServiceConfig = {}
  ) {
    this.config = { ...this.defaultConfig, ...config };
    this.restaurantRepository = this.dataSource.getRepository(Restaurant);
    this.dailyFeedRepository =
      this.dataSource.getRepository(RestaurantDailyFeed);

    this.initializeDatabase()
      .then(() => this.shuffleRestaurantDailyFeed())
      .catch((error) => {
        console.error('Error initializing db:', error);
      });
    // then shuffle

    cron.schedule('0 0 * * *', async () => {
      console.log('Running daily restaurant shuffle...');
      // shuffle
    });
  }

  private async initializeDatabase(): Promise<void> {
    try {
      if (!this.dataSource.isInitialized) {
        await this.dataSource.initialize();
      }
      console.log('Database connection successful:', new Date());

      this.seedRestaurantIfEmpty();
    } catch (error) {
      console.error('Database Initialize failed:', error);
      throw new Error(
        `Failed to initialize database: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  private async seedRestaurantIfEmpty(): Promise<void> {
    const count = await this.restaurantRepository.count();

    if (count === 0) {
      console.log('No restaurants in db, seeding...');
      await this.seedRestaurantsData();
    } else {
      console.log(`Found ${count} restaurants in database, skipping seed.`);
    }
  }

  private async seedRestaurantsData(): Promise<void> {
    try {
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        const restaurantEntities = restaurantData.map((restaurant) => {
          const entity = new Restaurant();

          entity.name = restaurant.name;
          entity.address = restaurant.address;
          entity.cuisine_type = restaurant.cuisine_type;
          entity.price_range = restaurant.price_range;
          entity.rating = restaurant.rating;
          entity.longitude = restaurant.longitude;
          entity.latitude = restaurant.latitude;
          entity.open_hours = restaurant.open_hours;
          entity.contact_info = restaurant.contact_info;

          return entity;
        });

        // save all restaurants in a batch
        await this.restaurantRepository.save(restaurantEntities);

        await queryRunner.commitTransaction();
        console.log('Restaurant seed data inserted successfully');
      } catch (error) {
        await queryRunner.rollbackTransaction();
        console.error('Error seeding restaurant data:', error);
        throw error;
      } finally {
        await queryRunner.release();
      }
    } catch (error) {
      console.error('Failed to seed restaurant data:', error);
      throw error;
    }
  }

  async getRestaurantById(id: number): Promise<Restaurant | null> {
    try {
      if (!Number(id) || id <= 0) {
        throw new Error('Invalid restaurant id');
      }

      return await this.restaurantRepository.findOneBy({ id });
    } catch (error) {
      console.error(`Error fetching restaurant ID ${id}:`, error);
      throw error;
    }
  }

  async getRestaurants(
    options: RestaurantFilterOptions = {}
  ): Promise<PaginatedResponse<Restaurant>> {
    try {
      // validate inputs
      const {
        longitude,
        latitude,
        radius = DEFAULT_RADIUS_KM,
        cuisineType,
        priceRange,
        minRating = 0,
        limit = this.config.defaultLimit,
        offset = 0,
      } = options;

      if (minRating < 0 || minRating > 5) {
        throw new Error('Rating must be between 0 and 5.');
      }

      if (radius > this.config.maxSearchRadius) {
        throw new Error(
          `Search radius cannot exceed ${this.config.maxSearchRadius}`
        );
      }

      //   create query builder to join with daily feed
      const queryBuilder = this.dailyFeedRepository
        .createQueryBuilder('feed')
        .innerJoinAndSelect('feed.restaurant', 'restaurant')
        .where('feed.date = CURRENT_DATE');

      // Apply filters
      if (cuisineType) {
        queryBuilder.andWhere('restaurant.cuisine_type = :cuisineType', {
          cuisineType,
        });
      }

      if (priceRange) {
        queryBuilder.andWhere('restaurant.price_range = :priceRange', {
          priceRange,
        });
      }

      if (minRating > 0) {
        queryBuilder.andWhere('restaurant.rating >= :minRating', { minRating });
      }

      // Apply location filter if provided
      if (longitude !== undefined && latitude !== undefined) {
        // Using Haversine formula in TypeORM query
        queryBuilder.andWhere(
          `
          (6371 * acos(
            cos(radians(:latitude)) * 
            cos(radians(restaurant.latitude)) * 
            cos(radians(restaurant.longitude) - radians(:longitude)) + 
            sin(radians(:latitude)) * 
            sin(radians(restaurant.latitude))
          )) <= :radius
        `,
          { latitude, longitude, radius }
        );
      }

      //   apply sorting, pagination
      queryBuilder.orderBy('feed.position', 'ASC').skip(offset).take(limit);

      //   execute query
      const [restaurants, total] = await queryBuilder.getManyAndCount();

      // Map to Restaurant objects
      const mappedResults = restaurants.map((feed) => feed.restaurant);

      return paginateResponse<Restaurant>(
        mappedResults,
        total,
        Number.isInteger(limit) ? limit : 10,
        Number.isInteger(offset) ? offset : 0
      );
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      throw error;
    }
  }

  /**
   * Create a new restaurant
   * @param data Restaurant data
   * @returns Created restaurant
   */
  async createRestaurant(data: CreateRestaurantData): Promise<Restaurant> {
    try {
      this.validateRestaurantData(data);

      const restaurant = new Restaurant();
      restaurant.name = data.name;
      restaurant.address = data.address;
      restaurant.cuisine_type = data.cuisine_type;
      restaurant.price_range = data.price_range;
      restaurant.rating = data.rating;
      restaurant.longitude = data.longitude;
      restaurant.latitude = data.latitude;
      restaurant.open_hours = data.open_hours || null;
      restaurant.contact_info = data.contact_info || null;

      return await this.restaurantRepository.save(restaurant);
    } catch (error) {
      console.error('Error creating restaurant:', error);
      throw error;
    }
  }

  /**
   * Update an existing restaurant
   * @param id Restaurant ID
   * @param data Updated restaurant data
   * @returns Updated restaurant or null if not found
   */
  async updateRestaurant(
    id: number,
    data: UpdateRestaurantData
  ): Promise<Restaurant | null> {
    try {
      if (!Number.isInteger(id) || id <= 0) {
        throw new Error('Invalid restaurant ID');
      }

      if (Object.keys(data).length === 0) {
        throw new Error('No update data provided');
      }

      const restaurant = await this.restaurantRepository.findOneBy({ id });
      if (!restaurant) {
        return null;
      }

      //   Update only provided fields
      Object.assign(restaurant, data);

      return await this.restaurantRepository.save(restaurant);
    } catch (error) {
      console.error(`Error updating restaurant with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a restaurant by ID
   * @param id Restaurant ID
   * @returns True if restaurant was deleted, false if not found
   */
  async deleteRestaurant(id: number) {
    try {
      if (!Number.isInteger(id) || id <= 0) {
        throw new Error('Invalid restaurant ID');
      }

      const result = await this.restaurantRepository.delete(id);
      return (
        result.affected !== undefined &&
        result.affected !== null &&
        result.affected > 0
      );
    } catch (error) {
      console.error(`Error deleting restaurant with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get popular cuisines in the database
   * @param limit Maximum number of cuisine types to return
   * @returns Array of cuisine types with their counts
   */
  async getPopularCuisines(
    limit = 10
  ): Promise<{ cuisine_type: string; count: number }[]> {
    try {
      return await this.restaurantRepository
        .createQueryBuilder('restaurant')
        .select('restaurant.cuisine_type', 'cuisine_type')
        .addSelect('COUNT(*)', 'count')
        .groupBy('restaurant.cuisine_type')
        .orderBy('count', 'DESC')
        .limit(limit)
        .getRawMany();
    } catch (error) {
      console.error('Error fetching popular cuisines:', error);
      throw error;
    }
  }

  /**
   * Get top rated restaurants
   * @param limit Maximum number of restaurants to return
   * @returns Array of top rated restaurants
   */
  async getTopRatedRestaurants(limit = 10): Promise<Restaurant[]> {
    try {
      return await this.restaurantRepository.find({
        order: {
          rating: 'DESC',
        },
        take: limit,
      });
    } catch (error) {
      console.error('Error fetching top rated restaurants:', error);
      throw error;
    }
  }

  /**
   * Validate restaurant data
   * @param data Restaurant data to validate
   * @private
   */
  private validateRestaurantData(data: CreateRestaurantData): void {
    if (!data.name || data.name.trim().length === 0) {
      throw new Error('Restaurant name is required');
    }

    if (!data.address || data.address.trim().length === 0) {
      throw new Error('Restaurant address is required');
    }

    if (!data.cuisine_type || data.cuisine_type.trim().length === 0) {
      throw new Error('Cuisine type is required');
    }

    if (!data.price_range || data.price_range < 0 || data.price_range > 5) {
      throw new Error('Price range must be between 0 and 5');
    }

    if (data.rating < 0 || data.rating > 5) {
      throw new Error('Rating must be between 0 and 5');
    }

    if (data.longitude < -180 || data.longitude > 180) {
      throw new Error('Longitude must be between -180 and 180');
    }

    if (data.latitude < -90 || data.latitude > 90) {
      throw new Error('Latitude must be between -90 and 90');
    }
  }

  // * shuffle restaurants for daily feed
  async shuffleRestaurantDailyFeed(): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      try {
        // clear existing feeds
        await this.dailyFeedRepository.clear();

        //   get all restaurant IDs
        const restaurants = await this.restaurantRepository.find({
          select: ['id'],
        });

        const shuffled = [...restaurants].sort(() => Math.random() - 0.5);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const feedEntries: RestaurantDailyFeed[] = shuffled.map(
          (restaurant, index) => {
            const feed = new RestaurantDailyFeed();

            feed.date = today;
            feed.position = index + 1;
            feed.restaurant_id = restaurant.id;
            return feed;
          }
        );

        await this.dailyFeedRepository.save(feedEntries);

        await queryRunner.commitTransaction();
        console.log(
          `Daily feed updated for ${today.toISOString().split('T')[0]} with ${feedEntries.length} restaurants`
        );
      } catch (error) {
        await queryRunner.rollbackTransaction();
        console.error('Error updating daily feed:', error);
        throw error;
      } finally {
        await queryRunner.release();
      }
    } catch (error) {
      console.error(`Error shuffling daily feed:`, error);
      throw error;
    }
  }

  /**
   * Close the database connection
   */
  async close(): Promise<void> {
    try {
      if (this.dataSource.isInitialized) {
        await this.dataSource.destroy();
      }
      console.log('Database connection closed');
    } catch (error) {
      console.error('Error closing database connection:', error);
      throw error;
    }
  }
}
