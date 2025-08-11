import {
  CreateRestaurantUserDto,
  IRestaurantUser,
  UpdateRestaurantUserData,
} from '@ewn/types/restaurant-user.type';
import { DbService } from 'src/db/db';
import logger from 'src/log/logger';

export class RestaurantUserRepository {
  constructor(private readonly dbService: DbService) {}

  create(createRestaurantUserDto: CreateRestaurantUserDto) {
    return {
      ...createRestaurantUserDto,
      created_at: new Date(),
      updated_at: new Date(),
    };
  }

  async save(
    createRestaurantUserDto: CreateRestaurantUserDto
  ): Promise<IRestaurantUser> {
    try {
      const newRelationship = this.create(createRestaurantUserDto);
      return await this.dbService.getConnection().query(
        `INSERT INTO restaurant_user (user_id, restaurant_id, upvoted, favorited, rating, comment, visited_at, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          newRelationship.user_id,
          newRelationship.restaurant_id,
          newRelationship.upvoted,
          newRelationship.favorited,
          newRelationship.rating,
          newRelationship.comment,
          newRelationship.visited_at,
          newRelationship.created_at,
          newRelationship.updated_at,
        ]
      );
    } catch (error) {
      logger.error(`Error saving restaurant user relationship:`, error);
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const relationship = await this.dbService
        .getConnection()
        .oneOrNone(`SELECT * FROM restaurant_user WHERE id = $1`, [id]);

      return relationship;
    } catch (error) {
      logger.error(`Error fetching restaurant with ID ${id}:`, error);
      throw error;
    }
  }

  async update(id: number, data: UpdateRestaurantUserData) {
    const fields = Object.keys(data)
      .map((key, idx) => `${key} = $${idx + 2}`)
      .join(', ');

    const values = Object.values(data);

    try {
      const updatedRelationship = await this.dbService
        .getConnection()
        .oneOrNone(
          `UPDATE restaurant_user SET ${fields} WHERE id = $1 RETURNING *`,
          [id, ...values]
        );

      return updatedRelationship;
    } catch (error) {
      logger.error(`Error updating restaurant with ID ${id}:`, error);
      throw error;
    }
  }

  async findByRestaurantIdAndUserId(
    restaurant_id: string,
    user_id: string
  ): Promise<IRestaurantUser> {
    try {
      const relationship = await this.dbService
        .getConnection()
        .oneOrNone(
          `SELECT * FROM restaurant_user WHERE restaurant_id = $1 AND user_id = $2`,
          [restaurant_id, user_id]
        );

      return relationship;
    } catch (error) {
      logger.error(`Error fetching restaurant user relationship:`, error);
      throw error;
    }
  }

  async upsert(
    restaurantId: string,
    userId: string,
    data: Partial<CreateRestaurantUserDto>
  ): Promise<IRestaurantUser> {
    try {
      const existingRelationship = await this.findByRestaurantIdAndUserId(
        restaurantId,
        userId
      );

      if (existingRelationship) {
        return await this.update(
          existingRelationship.id,
          data as unknown as UpdateRestaurantUserData
        );
      } else {
        // Ensure we have user_id and restaurant_id in the data
        const fullData: CreateRestaurantUserDto = {
          ...(data as Partial<CreateRestaurantUserDto>),
          user_id: userId,
          restaurant_id: parseInt(restaurantId),
        };
        return await this.save(fullData);
      }
    } catch (error) {
      logger.error(`Error upserting restaurant user relationship:`, error);
      throw error;
    }
  }
}
