import {
  CreateRestaurant,
  CreateRestaurantDto,
  IRestaurant,
  RestaurantsRepositoryConfig,
  UpdateRestaurantDto,
} from '@ewn/types/restaurants.type';
import dotenv from 'dotenv';
import cron from 'node-cron';
import { DbService } from 'src/db/db';
import { DEFAULT_LIMIT, MAX_SEARCH_RADIUS } from 'src/global/constants';
import logger from 'src/log/logger';

dotenv.config();

const TABLE_NAME = 'restaurants';

export class RestaurantsRepository {
  private config: RestaurantsRepositoryConfig;

  constructor(private readonly dbService: DbService) {
    this.config = {
      maxSearchRadius: MAX_SEARCH_RADIUS,
      defaultLimit: DEFAULT_LIMIT,
    };

    this.aggregateUserData();
    cron.schedule('0 * * * *', async () => {
      try {
        this.aggregateUserData();
      } catch (error) {
        logger.error('Error running CRON in restaurantRepo:', error);
      }
    });
  }

  create(createRestaurantDto: CreateRestaurantDto): CreateRestaurant {
    return {
      ...createRestaurantDto,
      created_at: new Date(),
      updated_at: new Date(),
    };
  }

  async save(restaurant: CreateRestaurant): Promise<IRestaurant> {
    try {
      return await this.dbService.getConnection().one<IRestaurant>(
        `INSERT INTO ${TABLE_NAME} (
          name, address, price_range, longitude, latitude, website, img_url, outbound_link, rating, average_ratings,
          contributor_username, google_id, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
        ) RETURNING *`,
        [
          restaurant.name,
          restaurant.address,
          restaurant.price_range,
          restaurant.longitude,
          restaurant.latitude,
          restaurant.website || null,
          restaurant.img_url || null,
          restaurant.outbound_link || null,
          restaurant.rating || 0,
          restaurant.average_ratings || 0,
          restaurant.contributor_username || null,
          restaurant.google_id || null,
          restaurant.created_at,
          restaurant.updated_at,
        ]
      );
    } catch (error) {
      logger.error('Error saving restaurant:', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<IRestaurant | null> {
    try {
      const restaurant = await this.dbService
        .getConnection()
        .oneOrNone<IRestaurant>(`SELECT * FROM ${TABLE_NAME} WHERE id = $1`, [
          id,
        ]);
      return restaurant || null;
    } catch (error) {
      logger.error(`Error fetching restaurant with ID ${id}:`, error);
      throw error;
    }
  }

  async getRestaurantsByQuery(
    query: string,
    params: unknown[]
  ): Promise<IRestaurant[]> {
    try {
      return await this.dbService
        .getConnection()
        .any<IRestaurant>(query, params);
    } catch (error) {
      logger.error('Error fetching restaurants by query:', error);
      throw error;
    }
  }

  async update(id: number, data: UpdateRestaurantDto) {
    try {
      const fields = Object.keys(data)
        .map((key, idx) => `${key} = $${idx + 3}`)
        .join(', ');

      const values = Object.values(data);

      return await this.dbService
        .getConnection()
        .none(
          `UPDATE ${TABLE_NAME} SET ${fields}, updated_at = $1 WHERE id = $2`,
          [new Date(), id, ...values]
        );
    } catch (error) {
      logger.error(`Error updating restaurant with ID ${id}:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.dbService
        .getConnection()
        .result(`DELETE FROM ${TABLE_NAME} WHERE id = $1`, [id]);
      return result.rowCount > 0;
    } catch (error) {
      logger.error(`Error deleting restaurant with ID ${id}:`, error);
      throw error;
    }
  }

  async aggregateUserData(): Promise<void> {
    try {
      await this.dbService.getConnection().none(`
        UPDATE ${TABLE_NAME} r
        SET total_upvotes = (
          SELECT COUNT(*)
          FROM restaurant_user ru
          WHERE ru.restaurant_id = r.id AND ru.upvoted = true
        ),
        total_downvotes = (
          SELECT COUNT(*)
          FROM restaurant_user ru
          WHERE ru.restaurant_id = r.id AND ru.downvoted = true
        ),
        total_favorites = (
          SELECT COUNT(*)
          FROM restaurant_user ru
          WHERE ru.restaurant_id = r.id AND ru.favorited = true
        ),
        total_comments = (
          SELECT COUNT(*)
          FROM restaurant_user ru 
          WHERE ru.restaurant_id = r.id AND comment IS NOT NULL AND ru.comment <> ''
        ),
        average_ratings = (
          SELECT COALESCE(AVG(ru.rating), 0)
          FROM restaurant_user ru
          WHERE ru.restaurant_id = r.id AND ru.rating IS NOT NULL
        )
        `);
      logger.info('Users data aggregated successfully');
    } catch (error) {
      logger.error('Error aggregating Users data:', error);
      throw error;
    }
  }
}
