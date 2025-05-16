import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import '../container';
import { RestaurantService } from '../db/restaurant';

@injectable()
export class FeedController {
  constructor(
    @inject('RestaurantService') private restaurantService: RestaurantService
  ) {}

  /**
   * @openapi
   * /feed:
   *   get:
   *     tags:
   *       - Restaurants
   *     summary: Get a list of restaurants
   *     security:
   *       - ApiKeyAuth: []
   *     parameters:
   *       - in: query
   *         name: longitude
   *         schema:
   *           type: integer
   *         description: longitude
   *       - in: query
   *         name: latitude
   *         schema:
   *           type: integer
   *         description: latitude
   *       - in: query
   *         name: radius
   *         schema:
   *           type: integer
   *         description: default 5km
   *       - in: query
   *         name: cuisineType
   *         schema:
   *           type: integer
   *         description: e.g. Italian
   *       - in: query
   *         name: priceRange
   *         schema:
   *           type: integer
   *         description: price range from 1 to 5 (least to greatest)
   *       - in: query
   *         name: minRating
   *         schema:
   *           type: integer
   *         description: range from 1 to 5 (least to greatest)
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *         description:
   *       - in: query
   *         name: offset
   *         schema:
   *           type: integer
   *         description:
   *     responses:
   *       200:
   *         description: A list of restaurants
   */
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
      .then((data) => {
        console.log('fetched restaurants');
        res.send(data);
      })
      .catch((error) => {
        console.log(`Error fetching restaurants:${error}`);
        res.status(500).send({ error: 'Internal Server Error' });
      });
  };
}
