import {
  CreateRestaurantUserDto,
  IRestaurantUser,
} from '@ewn/types/restaurant-user.type';
import { RestaurantUserRepository } from 'src/repositories/restaurant-user.repo';

export class RestaurantUserService {
  constructor(
    private readonly restaurantUserRepository: RestaurantUserRepository
  ) {}

  async addRestaurantUser(
    data: CreateRestaurantUserDto
  ): Promise<IRestaurantUser> {
    const result = this.restaurantUserRepository.create(data);
    return await this.restaurantUserRepository.save(result);
  }

  async toggleUpvote(
    restaurantId: string,
    userId: string,
    upvoted: boolean
  ): Promise<IRestaurantUser> {
    return await this.restaurantUserRepository.upsert(restaurantId, userId, {
      upvoted,
    });
  }

  async toggleFavorite(
    restaurantId: string,
    userId: string,
    favorited: boolean
  ): Promise<IRestaurantUser> {
    return await this.restaurantUserRepository.upsert(restaurantId, userId, {
      favorited,
    });
  }

  async upsertComment(
    restaurantId: string,
    userId: string,
    comment: string
  ): Promise<IRestaurantUser> {
    return await this.restaurantUserRepository.upsert(restaurantId, userId, {
      comment,
    });
  }

  async updateRating(
    restaurantId: string,
    userId: string,
    rating: number
  ): Promise<IRestaurantUser> {
    return await this.restaurantUserRepository.upsert(restaurantId, userId, {
      rating,
    });
  }
}
