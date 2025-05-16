import dotenv from 'dotenv';
import cron from 'node-cron';
import pgPromise, { IDatabase } from 'pg-promise';
import { IClient } from 'pg-promise/typescript/pg-subset';
import { injectable } from 'tsyringe';
import '../../container';
import { PaginatedResponse, paginateResponse } from '../../utils/pagination';
import {
  CreateRestaurantData,
  IRestaurant,
  RestaurantFilterOptions,
  RestaurantServiceConfig,
  UpdateRestaurantData,
} from './type';

dotenv.config();

const tableName = 'restaurants';

@injectable()
export class RestaurantService {
  private db: IDatabase<unknown, IClient>;
  private readonly config: Required<RestaurantServiceConfig>;
  private readonly defaultConfig: Required<RestaurantServiceConfig> = {
    connectionString: process.env.DATABASE_URL || '',
    maxSearchRadius: 25, // kilometers
    defaultLimit: 20,
  };

  constructor(config: RestaurantServiceConfig = {}) {
    this.config = { ...this.defaultConfig, ...config };

    const pgp = pgPromise();

    this.db = pgp(this.config.connectionString);
    this.initializeDatabase();
    this.createRestaurantDailyFeed();

    cron.schedule('0 0 * * *', async () => {
      console.log('Running daily restaurant shuffle...');
      this.shuffleRestaurantDailyFeed();
    });
  }

  private async initializeDatabase(): Promise<void> {
    try {
      const data = await this.db.one('SELECT NOW() AS current_time');
      console.log('Database connection successful:', data.current_time);

      await this.verifyDatabaseStructure();
    } catch (error) {
      console.error('Database initialization failed:', error);
      // Consider a more robust recovery strategy in production
      throw new Error(
        `Failed to initialize database: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  private async verifyDatabaseStructure(): Promise<void> {
    try {
      const tableExists = await this.db.oneOrNone(
        `SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = '${tableName}')`
      );

      if (!tableExists || !tableExists.exists) {
        console.warn(
          'Restaurants table does not exist, attempting to create it...'
        );
        await this.createRestaurantsTable();
      }
    } catch (error) {
      console.error('Error verifying database structure:', error);
      throw error;
    }
  }

  private async createRestaurantsTable(): Promise<void> {
    try {
      await this.db.none(`
        CREATE TABLE IF NOT EXISTS ${tableName} (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          address TEXT NOT NULL,
          cuisine_type VARCHAR(100) NOT NULL,
          price_range DECIMAL(3, 2) NOT NULL CHECK (price_range >= 0 AND price_range <= 5),
          rating DECIMAL(3, 2) NOT NULL CHECK (rating >= 0 AND rating <= 5),
          longitude DECIMAL(11, 8) NOT NULL,
          latitude DECIMAL(10, 8) NOT NULL,
          open_hours TEXT,
          contact_info TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE INDEX IF NOT EXISTS idx_restaurants_location ON restaurants (longitude, latitude);
        CREATE INDEX IF NOT EXISTS idx_restaurants_cuisine ON restaurants (cuisine_type);
        CREATE INDEX IF NOT EXISTS idx_restaurants_rating ON restaurants (rating);
      `);
      console.log('Restaurants table created successfully');
    } catch (error) {
      console.error('Failed to create restaurants table:', error);
      throw error;
    }
  }

  async getRestaurantById(id: number) {
    try {
      if (!Number.isInteger(id) || id <= 0) {
        throw new Error('Invalid restaurant ID');
      }

      return await this.db.oneOrNone<IRestaurant>(
        `SELECT * FROM ${tableName} WHERE id = $1`,
        [id]
      );
    } catch (error) {
      console.error(`Error fetching restaurant by ID ${id}:`, error);
    }
  }

  /**
   * Get restaurants by location within a radius
   * @param options Filter options for the search
   * @returns Array of restaurants matching the criteria
   */
  async getRestaurants(
    options: RestaurantFilterOptions = {}
  ): Promise<PaginatedResponse<IRestaurant>> {
    try {
      // Validate inputs
      const {
        longitude,
        latitude,
        radius = 5, // Default 5km radius
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

      // Build query based on provided filters
      let query = `
      SELECT r.*
      FROM restaurant_daily_feed f
      JOIN restaurants r on r.id = f.restaurant_id
      WHERE f.date = current_date
    `;
      const params: unknown[] = [];
      let paramIndex = 1;

      // If location is provided, search by proximity
      if (longitude !== undefined && latitude !== undefined) {
        // Use Haversine formula to calculate distance
        query += `
        AND (
          6371 * acos(
            cos(radians($${paramIndex++})) * 
            cos(radians(latitude)) * 
            cos(radians(longitude) - radians($${paramIndex++})) + 
            sin(radians($${paramIndex++})) * 
            sin(radians(latitude))
          )
        ) <= $${paramIndex++}
      `;
        params.push(latitude, longitude, latitude, radius);
      }

      if (cuisineType) {
        query += ` AND cuisine_type = $${paramIndex++}`;
        params.push(cuisineType);
      }

      if (priceRange) {
        query += ` AND price_range = $${paramIndex++}`;
        params.push(priceRange);
      }

      if (minRating > 0) {
        query += ` AND rating >= $${paramIndex++}`;
        params.push(minRating);
      }

      query += ' ORDER BY f.position';

      if (limit > 0) {
        query += ` LIMIT $${paramIndex++}`;
        params.push(limit);
      }

      if (offset > 0) {
        query += ` OFFSET $${paramIndex++}`;
        params.push(offset);
      }

      const data = await this.db.any<IRestaurant>(query, params);
      const total = await this.db.one(
        'SELECT COUNT(*) FROM restaurants',
        [],
        (row) => +row.count
      );

      return paginateResponse<IRestaurant>(
        data,
        total,
        // todo: doesn't seem like the best solution but it works
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
  async createRestaurant(data: CreateRestaurantData): Promise<IRestaurant> {
    try {
      this.validateRestaurantData(data);

      return await this.db.one<IRestaurant>(
        `INSERT INTO restaurants (
          name, address, cuisine_type, price_range, rating, 
          longitude, latitude, open_hours, contact_info
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9
        ) RETURNING *`,
        [
          data.name,
          data.address,
          data.cuisine_type,
          data.price_range,
          data.rating,
          data.longitude,
          data.latitude,
          data.open_hours || null,
          data.contact_info || null,
        ]
      );
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
  ): Promise<IRestaurant | null> {
    try {
      if (!Number.isInteger(id) || id <= 0) {
        throw new Error('Invalid restaurant ID');
      }

      if (Object.keys(data).length === 0) {
        throw new Error('No update data provided');
      }

      // Prepare update query
      const updateColumns: string[] = [];
      const values: unknown[] = [];
      let paramIndex = 1;

      // Build update statement dynamically based on provided fields
      for (const [key, value] of Object.entries(data)) {
        if (value !== undefined) {
          updateColumns.push(`${key} = $${paramIndex++}`);
          values.push(value);
        }
      }

      // Add updated_at timestamp
      updateColumns.push(`updated_at = $${paramIndex++}`);
      values.push(new Date());

      // Add WHERE clause parameter
      values.push(id);

      const query = `
        UPDATE restaurants 
        SET ${updateColumns.join(', ')} 
        WHERE id = $${paramIndex} 
        RETURNING *
      `;

      return await this.db.oneOrNone<IRestaurant>(query, values);
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
  async deleteRestaurant(id: number): Promise<boolean> {
    try {
      if (!Number.isInteger(id) || id <= 0) {
        throw new Error('Invalid restaurant ID');
      }

      const result = await this.db.result(
        'DELETE FROM restaurants WHERE id = $1',
        [id],
        (r) => r.rowCount
      );

      return result > 0;
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
      return await this.db.any(
        `SELECT cuisine_type, COUNT(*) as count 
         FROM restaurants 
         GROUP BY cuisine_type 
         ORDER BY count DESC 
         LIMIT $1`,
        [limit]
      );
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
  async getTopRatedRestaurants(limit = 10): Promise<IRestaurant[]> {
    try {
      return await this.db.any<IRestaurant>(
        'SELECT * FROM restaurants ORDER BY rating DESC LIMIT $1',
        [limit]
      );
    } catch (error) {
      console.error('Error fetching top rated restaurants:', error);
      throw error;
    }
  }

  /**
   * Close the database connection
   */
  async close(): Promise<void> {
    try {
      await this.db.$pool.end();
      console.log('Database connection closed');
    } catch (error) {
      console.error('Error closing database connection:', error);
      throw error;
    }
  }

  async createRestaurantDailyFeed() {
    await this.db.none(`
      CREATE TABLE IF NOT EXISTS restaurant_daily_feed (
      date DATE NOT NULL,
      position INT NOT NULL,
      restaurant_id INTEGER NOT NULL,
      PRIMARY KEY (date, position),
      FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
    );
      `);
  }

  async shuffleRestaurantDailyFeed(): Promise<void> {
    try {
      await this.db.none(
        `DELETE FROM restaurant_daily_feed WHERE date = current_date`
      );
      await this.db.none(`
        INSERT INTO restaurant_daily_feed (date, position, restaurant_id)
        SELECT current_date, row_number() OVER (ORDER BY RANDOM()), id
        FROM restaurants
        ORDER BY RANDOM();
      `);
    } catch (error) {
      console.error(`Error inserting daily feed:`, error);
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
}
