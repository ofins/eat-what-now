import {
  CreateRestaurant,
  CreateRestaurantDto,
  IRestaurant,
  RestaurantFilterOptions,
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
    this.aggregateComments();

    cron.schedule('0 * * * *', async () => {
      try {
        this.aggregateUserData();
        this.aggregateComments();
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
          name, address, price_range, longitude, latitude, website, img_url, outbound_link, rating,
          contributor_username, google_id, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
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

  async findByQuery(query: string, params: unknown[]): Promise<IRestaurant[]> {
    try {
      return await this.dbService
        .getConnection()
        .any<IRestaurant>(query, params);
    } catch (error) {
      logger.error('Error fetching restaurants by query:', error);
      throw error;
    }
  }

  async findByUserId(
    userId: string,
    options: RestaurantFilterOptions
  ): Promise<IRestaurant[]> {
    let query = `
    SELECT
      r.*,
      ru.upvoted as user_upvoted,
      ru.favorited as user_favorited,
      ru.comment as user_comment
    FROM ${TABLE_NAME} r
    LEFT JOIN restaurant_user ru ON r.id = ru.restaurant_id AND ru.user_id = $1
    WHERE 1=1`;
    const params: unknown[] = [userId];

    if (options) {
      // Apply any filtering or pagination based on the options
      if (options.radius && options.longitude && options.latitude) {
        query += ` AND ST_DWithin(
        ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography, 
        ST_SetSRID(ST_MakePoint($${params.length + 1}, $${params.length + 2}), 4326)::geography, 
        $${params.length + 3}
      )`;
        params.push(options.longitude, options.latitude, options.radius * 1000); // Convert km to meters
      }

      if (options.priceRange) {
        query += ` AND price_range = $${params.length + 1}`;
        params.push(options.priceRange);
      }

      if (options.minRating) {
        query += ` AND rating >= $${params.length + 1}`;
        params.push(options.minRating);
      }

      if (options.limit) {
        query += ` LIMIT $${params.length + 1}`;
        params.push(options.limit);
      }

      if (options.offset) {
        query += ` OFFSET $${params.length + 1}`;
        params.push(options.offset);
      }
    }

    return await this.findByQuery(query, params);
  }

  async findRestaurantsByQuery(
    options: RestaurantFilterOptions
  ): Promise<IRestaurant[]> {
    let query = 'SELECT * FROM restaurants WHERE 1=1';
    const params: unknown[] = [];

    if (options.radius && options.longitude && options.latitude) {
      query += ` AND ST_DWithin(
        ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography, 
        ST_SetSRID(ST_MakePoint($${params.length + 1}, $${params.length + 2}), 4326)::geography, 
        $${params.length + 3}
      )`;
      params.push(options.longitude, options.latitude, options.radius * 1000); // Convert km to meters
    }

    if (options.priceRange) {
      query += ` AND price_range = $${params.length + 1}`;
      params.push(options.priceRange);
    }

    if (options.minRating) {
      query += ` AND rating >= $${params.length + 1}`;
      params.push(options.minRating);
    }

    if (options.limit) {
      query += ` LIMIT $${params.length + 1}`;
      params.push(options.limit);
    }

    if (options.offset) {
      query += ` OFFSET $${params.length + 1}`;
      params.push(options.offset);
    }

    return await this.findByQuery(query, params);
  }

  async update(
    id: number,
    data: UpdateRestaurantDto
  ): Promise<IRestaurant | null> {
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

  async getTotalCount() {
    const result = await this.dbService
      .getConnection()
      .one(`SELECT COUNT(*) FROM ${TABLE_NAME}`);
    return result.count;
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

  private async aggregateUserData(): Promise<void> {
    try {
      await this.dbService.getConnection().none(`
        UPDATE ${TABLE_NAME} r
        SET total_upvotes = (
          SELECT COUNT(*)
          FROM restaurant_user ru
          WHERE ru.restaurant_id = r.id AND ru.upvoted = true
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
        rating = (
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

  private async aggregateComments(): Promise<void> {
    await this.dbService.getConnection().none(`
     WITH restaurant_comments AS (
      SELECT ru.restaurant_id, ru.updated_at, u.username, ru.comment
      FROM restaurant_user ru
      LEFT JOIN users u ON ru.user_id = u.id
      WHERE ru.comment IS NOT NULL AND ru.comment <> ''
    ),
    aggregated_comments AS (
      SELECT restaurant_id, 
        jsonb_agg(jsonb_build_object('updatedAt', updated_at, 'username', username, 'comment', comment)
          ORDER BY updated_at DESC
        ) as comment_json
      FROM restaurant_comments
      GROUP BY restaurant_id
    ),
    updated_comments AS (
      SELECT r.id, r.comments as old_comments, COALESCE(ac.comment_json, '[]'::jsonb) as new_comments
      FROM restaurants r
      LEFT JOIN aggregated_comments ac ON r.id = ac.restaurant_id
    )

    UPDATE restaurants
    SET comments = uc.new_comments
    FROM updated_comments uc
    WHERE restaurants.id = uc.id
    AND uc.old_comments IS DISTINCT FROM uc.new_comments;
    `);
  }
}
