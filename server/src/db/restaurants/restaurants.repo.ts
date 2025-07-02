import {
  CreateRestaurantData,
  IRestaurant,
  RestaurantFilterOptions,
  RestaurantsRepositoryConfig,
} from '@ewn/types/restaurants.type';
import dotenv from 'dotenv';
import cron from 'node-cron';
import {
  DEFAULT_LIMIT,
  DEFAULT_RADIUS_KM,
  MAX_SEARCH_RADIUS,
} from 'src/config';
import { PaginatedResponse, paginateResponse } from 'src/utils/pagination';
import BaseRepository from '../base.repo';
import { CreateRestaurant, UpdateRestaurant } from './restaurants.schema';
import db from 'src/db/db';
import { IDatabase } from 'pg-promise';
import { IClient } from 'pg-promise/typescript/pg-subset';
import logger from 'src/log/logger';

dotenv.config();

const TABLE_NAME = 'restaurants';

export class RestaurantsRepository extends BaseRepository {
  private config: RestaurantsRepositoryConfig;
  protected db: IDatabase<unknown, IClient>;

  constructor(
    config = {
      maxSearchRadius: MAX_SEARCH_RADIUS,
      defaultLimit: DEFAULT_LIMIT,
    }
  ) {
    super(db, TABLE_NAME);
    this.config = config;
    this.db = db;

    this.aggregateUserData();
    cron.schedule('0 * * * *', async () => {
      try {
        this.aggregateUserData();
      } catch (error) {
        logger.error('Error running CRON in restaurantRepo:', error);
      }
    });

    this.shuffleRestaurantDailyFeed();
    cron.schedule('0 0 * * *', async () => {
      logger.info('Running daily restaurant shuffle...');
      this.shuffleRestaurantDailyFeed();
    });
  }

  async getRestaurantById(id: number) {
    try {
      if (!Number.isInteger(id) || id <= 0) {
        throw new Error('Invalid restaurant ID');
      }

      return await this.db.oneOrNone<IRestaurant>(
        `SELECT * FROM ${TABLE_NAME} WHERE id = $1`,
        [id]
      );
    } catch (error) {
      logger.error(`Error fetching restaurant by ID ${id}:`, error);
    }
  }

  /**
   * Get restaurants by location within a radius
   * @param options Filter options for the search
   * @returns Array of restaurants matching the criteria
   */
  async getRestaurants(
    options: RestaurantFilterOptions = {
      limit: this.config.defaultLimit,
      offset: 0,
    }
  ): Promise<PaginatedResponse<IRestaurant>> {
    try {
      // Validate inputs
      const {
        longitude,
        latitude,
        radius = DEFAULT_RADIUS_KM,
        cuisineType,
        priceRange,
        minRating,
        limit = this.config.defaultLimit,
        offset,
      } = options;

      // Validate numeric inputs
      if (
        longitude !== undefined &&
        (isNaN(longitude) || longitude < -180 || longitude > 180)
      ) {
        throw new Error(
          'Longitude must be a valid number between -180 and 180'
        );
      }

      if (
        latitude !== undefined &&
        (isNaN(latitude) || latitude < -90 || latitude > 90)
      ) {
        throw new Error('Latitude must be a valid number between -90 and 90');
      }

      if (isNaN(radius) || radius <= 0) {
        throw new Error('Radius must be a valid positive number');
      }
      if (
        minRating === undefined ||
        isNaN(minRating) ||
        minRating < 0 ||
        minRating > 5
      ) {
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
      FROM restaurants_daily_feed f
      JOIN restaurants r on r.id = f.restaurant_id
      WHERE f.date = current_date
    `;
      const params: unknown[] = [];
      let paramIndex = 1;

      // If location is provided, search by using spatial queries
      if (longitude !== undefined && latitude !== undefined) {
        logger.info(
          `Adding spatial query with longitude: ${longitude}, latitude: ${latitude}, radius: ${radius}`
        );
        query += `
        AND ST_DWithin(
          r.geom::geography,
          ST_Point($${paramIndex++}, $${paramIndex++})::geography,
          $${paramIndex++} * 1000
        )
      `;
        params.push(longitude, latitude, radius);
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

      logger.info(`Executing query with params:`, {
        query: query.trim(),
        params,
      });

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
      logger.error('Error fetching restaurants:', error);
      throw error;
    }
  }

  /**
   * Create a new restaurant
   * @param data Restaurant data
   * @returns Created restaurant
   */
  async createRestaurant(data: CreateRestaurant): Promise<IRestaurant> {
    try {
      this.validateRestaurantData(data as CreateRestaurantData);

      return await this.db.one<IRestaurant>(
        `INSERT INTO ${TABLE_NAME} (
          name, address, price_range, longitude, latitude, website, img_url, outbound_link, rating, average_ratings
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
        ) RETURNING *`,
        [
          data.name,
          data.address,
          data.price_range,
          data.longitude,
          data.latitude,
          data.website || null,
          data.img_url || null,
          data.outbound_link || null,
          data.rating || 0,
          data.average_ratings || 0,
        ]
      );
    } catch (error) {
      logger.error('Error creating restaurant:', error);
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
    data: UpdateRestaurant
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
      logger.error(`Error updating restaurant with ID ${id}:`, error);
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
      const result = await this.db.tx(async (t) => {
        const dailyFeedDelete = await t.result(
          `DELETE FROM restaurants_daily_feed WHERE restaurant_id = $1`,
          [id],
          (r) => r.rowCount
        );

        const restaurantDelete = await t.result(
          `DELETE FROM restaurants WHERE id = $1`,
          [id],
          (r) => r.rowCount
        );

        return dailyFeedDelete + restaurantDelete;
      });

      return result > 1;
    } catch (error) {
      logger.error(`Error deleting restaurant with ID ${id}:`, error);
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
        'SELECT * FROM restaurants ORDER BY average_ratings DESC LIMIT $1',
        [limit]
      );
    } catch (error) {
      logger.error('Error fetching top rated restaurants:', error);
      throw error;
    }
  }

  /**
   * Close the database connection
   */
  async close(): Promise<void> {
    try {
      await this.db.$pool.end();
      logger.info('Database connection closed');
    } catch (error) {
      logger.error('Error closing database connection:', error);
      throw error;
    }
  }

  async shuffleRestaurantDailyFeed(): Promise<void> {
    try {
      await this.db.none(`DELETE FROM restaurants_daily_feed;`);
      await this.db.none(`
        INSERT INTO restaurants_daily_feed (date, position, restaurant_id)
        SELECT current_date, row_number() OVER (ORDER BY RANDOM()), id
        FROM restaurants
        ON CONFLICT (date, position) DO UPDATE
        SET restaurant_id = EXCLUDED.restaurant_id
      `);
    } catch (error) {
      logger.error(`Error inserting daily feed:`, error);
    }
  }

  async updateUpvoteCount(restaurantId: number, count: number): Promise<void> {
    try {
      if (!Number.isInteger(restaurantId) || restaurantId <= 0) {
        throw new Error('Invalid restaurant ID');
      }
      await this.db.none(
        `UPDATE ${TABLE_NAME} SET total_upvotes = total_upvotes + $2 WHERE id = $1`,
        [restaurantId, count]
      );
    } catch (error) {
      logger.error(
        `Error incrementing upvote count for restaurant ${restaurantId}:`,
        error
      );
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

    if (!data.price_range || data.price_range < 0 || data.price_range > 5) {
      throw new Error('Price range must be between 0 and 5');
    }

    if (data.longitude < -180 || data.longitude > 180) {
      throw new Error('Longitude must be between -180 and 180');
    }

    if (data.latitude < -90 || data.latitude > 90) {
      throw new Error('Latitude must be between -90 and 90');
    }
  }

  private async aggregateUserData(): Promise<void> {
    try {
      await this.db.none(`
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
