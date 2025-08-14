import {
  CreateRestaurantDto,
  IRestaurant,
  RestaurantFilterOptions,
  UpdateRestaurantDto,
} from '@ewn/types/restaurants.type';
import { Request } from 'express';
import { RestaurantsRepository } from 'src/repositories/restaurants.repo';
import { PaginatedResponse, paginateResponse } from 'src/utils/pagination';

export class RestaurantsService {
  constructor(private readonly restaurantsRepository: RestaurantsRepository) {}

  async getRestaurantById(id: string) {
    return this.restaurantsRepository.findOne(id);
  }

  async getRestaurantsByQuery(query: Request['query']) {
    const options = this.createOptionParams(query);
    const result =
      await this.restaurantsRepository.findRestaurantsByQuery(options);
    return this.createPaginateResponse(result, options);
  }

  async getRestaurantsByQueryOptionalUserId(
    userId: string,
    query: Request['query']
  ): Promise<PaginatedResponse<IRestaurant>> {
    const options = this.createOptionParams(query);

    // validate inputs

    const result = await this.restaurantsRepository.findByUserId(
      userId,
      options
    );
    return this.createPaginateResponse(result, options);
  }

  async createRestaurant(data: CreateRestaurantDto): Promise<IRestaurant> {
    const restaurant = this.restaurantsRepository.create(data);
    return await this.restaurantsRepository.save(restaurant);
  }

  async updateRestaurant(
    id: number,
    data: UpdateRestaurantDto
  ): Promise<IRestaurant | null> {
    return await this.restaurantsRepository.update(id, data);
  }

  async deleteRestaurant(id: string): Promise<boolean> {
    return await this.restaurantsRepository.delete(id);
  }

  private createOptionParams(query: Request['query']): RestaurantFilterOptions {
    const {
      longitude,
      latitude,
      radius = 5,
      cuisineType,
      priceRange,
      minRating = 0,
      limit = 10,
      offset = 0,
    } = query;

    return {
      longitude: parseFloat(longitude as string),
      latitude: parseFloat(latitude as string),
      radius: parseFloat(radius as string),
      cuisineType: typeof cuisineType === 'string' ? cuisineType : undefined,
      priceRange: priceRange === 'string' ? priceRange : undefined,
      minRating: parseFloat(minRating as string),
      limit: parseFloat(limit as string),
      offset: parseFloat(offset as string),
    };
  }

  private async createPaginateResponse(
    result: IRestaurant[],
    options: RestaurantFilterOptions
  ) {
    const totalCount = await this.restaurantsRepository.getTotalCount();

    return paginateResponse(
      result,
      Number(totalCount),
      options.limit,
      options.offset
    );
  }
}
