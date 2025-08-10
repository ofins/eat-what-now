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
      downvoted: !upvoted,
    });
  }
}
