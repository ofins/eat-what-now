import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import '../container';
import { RestaurantService } from '../db/restaurant';

@injectable()
export class FeedController {
  constructor(
    @inject('RestaurantService') private restaurantService: RestaurantService
  ) {}

  getRestaurants = (req: Request, res: Response) => {
    const {
      longitude,
      latitude,
      radius,
      cuisineType,
      priceRange,
      minRating,
      limit,
      offset,
    } = req.query;

    this.restaurantService
      .getRestaurants({
        longitude: parseFloat(longitude as string),
        latitude: parseFloat(latitude as string),
        radius: parseFloat(radius as string), // Default 5km radius
        cuisineType: typeof cuisineType === 'string' ? cuisineType : undefined,
        priceRange: priceRange === 'string' ? priceRange : undefined,
        minRating: parseFloat(minRating as string),
        limit: parseFloat(limit as string),
        offset: parseFloat(offset as string),
      })
      .then((data) => res.send(data))
      .catch((error) => {
        console.log(`Error fetching restaurants:${error}`);
        res.status(500).send({ error: 'Internal Server Error' });
      });
  };
}
