import {
  CreateRestaurantDto,
  RestaurantFilterOptions,
  UpdateRestaurantDto,
} from '@ewn/types/restaurants.type';
import { RestaurantsRepository } from 'src/repositories/restaurants.repo';
import { paginateResponse } from 'src/utils/pagination';

export class RestaurantsService {
  constructor(private readonly restaurantsRepository: RestaurantsRepository) {}

  async getRestaurantById(id: string) {
    return this.restaurantsRepository.findOne(id);
  }

  async getRestaurantsByQuery(options: RestaurantFilterOptions) {
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
      query += ` AND average_ratings >= $${params.length + 1}`;
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

    const result = await this.restaurantsRepository.getRestaurantsByQuery(
      query,
      params
    );

    return paginateResponse(
      result,
      result.length,
      options.limit,
      options.offset
    );
  }

  async createRestaurant(data: CreateRestaurantDto) {
    const restaurant = this.restaurantsRepository.create(data);
    return this.restaurantsRepository.save(restaurant);
  }

  async updateRestaurant(id: number, data: UpdateRestaurantDto) {
    return this.restaurantsRepository.update(id, data);
  }

  async deleteRestaurant(id: string) {
    return this.restaurantsRepository.delete(id);
  }
}
