import { CreateRestaurantUser } from '../restaurants/restaurants.schema';
import type { IRestaurantUser } from '@ewn/types/restaurant-user.type';
import { DbService } from 'src/db/db';

const TABLE_NAME = 'restaurant_user';

interface RestaurantRepositoryInterface {
  addRelationship(data: CreateRestaurantUser): Promise<IRestaurantUser>;
  toggleUpvote(userId: string, restaurantId: number): Promise<IRestaurantUser>;
  getRestaurantsForUser(userId: number): Promise<IRestaurantUser[]>;
  getUsersForRestaurant(restaurantId: number): Promise<IRestaurantUser[]>;
  getRestaurantDetails(restaurantId: number): Promise<{
    restaurant_id: number;
    totalUpvotes: number;
    totalDownvotes: number;
    totalFavorites: number;
    averageRating: number | null;
    comments: Array<{ user_id: string; comment: string }>;
    userCount: number;
    users: IRestaurantUser[];
  }>;
}

export class RestaurantUserRepository implements RestaurantRepositoryInterface {
  constructor(private readonly dbService: DbService) {}

  async addRelationship(data: CreateRestaurantUser): Promise<IRestaurantUser> {
    return this.dbService.getConnection().one(
      `
    INSERT INTO ${TABLE_NAME} (
      user_id, restaurant_id, upvoted, downvoted, favorited, rating, comment, visited_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8
    )
    ON CONFLICT (user_id, restaurant_id) DO UPDATE
    SET
      upvoted = EXCLUDED.upvoted,
      downvoted = EXCLUDED.downvoted,
      favorited = EXCLUDED.favorited,
      rating = EXCLUDED.rating,
      comment = EXCLUDED.comment,
      visited_at = EXCLUDED.visited_at,
      updated_at = now()
    RETURNING *
    `,
      [
        data.user_id,
        data.restaurant_id,
        data.upvoted ?? false,
        data.downvoted ?? false,
        data.favorited ?? false,
        data.rating ?? null,
        data.comment ?? null,
        data.visited_at ?? null,
      ]
    );
  }

  async toggleUpvote(userId: string, restaurantId: number) {
    const exists = await this.dbService
      .getConnection()
      .oneOrNone(
        `SELECT * FROM ${TABLE_NAME} WHERE user_id = $1 AND restaurant_id = $2`,
        [userId, restaurantId]
      );

    if (exists) {
      return this.dbService.getConnection().one(
        `
        UPDATE ${TABLE_NAME}
        SET upvoted = NOT upvoted, updated_at = NOW()
        WHERE user_id = $1 AND restaurant_id = $2
        RETURNING *
        `,
        [userId, restaurantId]
      );
    } else {
      return this.addRelationship({
        user_id: userId,
        restaurant_id: restaurantId,
        upvoted: true,
      });
    }
  }

  async getRestaurantsForUser(userId: number) {
    return this.dbService
      .getConnection()
      .any(`SELECT * FROM ${TABLE_NAME} WHERE user_id = $1`, [userId]);
  }

  async getUsersForRestaurant(restaurantId: number) {
    return this.dbService
      .getConnection()
      .any(`SELECT * FROM ${TABLE_NAME} WHERE restaurant_id = $1`, [
        restaurantId,
      ]);
  }

  async getRestaurantDetails(restaurantId: number) {
    const rows = await this.getUsersForRestaurant(restaurantId);

    const totalUpvotes = rows.filter((r) => r.upvoted).length;
    const totalDownvotes = rows.filter((r) => r.downvoted).length;
    const totalFavorites = rows.filter((r) => r.favorited).length;
    const ratings = rows
      .map((r) => r.rating)
      .filter((r) => typeof r === 'number') as number[];
    const averageRating = ratings.length
      ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
      : null;
    const comments = rows
      .filter((r) => r.comment)
      .map((r) => ({ user_id: r.user_id, comment: r.comment }));

    return {
      restaurant_id: restaurantId,
      totalUpvotes,
      totalDownvotes,
      totalFavorites,
      averageRating,
      comments,
      userCount: rows.length,
      users: rows,
    };
  }
}
