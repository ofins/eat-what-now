import { Request, Response } from 'express';
import { Logger } from 'src/log/logger';
import { RestaurantsService } from 'src/services/restaurants.service';

export class RestaurantsController {
  constructor(
    private readonly restaurantsService: RestaurantsService,
    private readonly logger: Logger
  ) {}

  async getRestaurants(req: Request, res: Response) {
    const {
      longitude,
      latitude,
      radius = 5,
      cuisineType,
      priceRange,
      minRating = 0,
      limit = 10,
      offset = 0,
    } = req.query;

    this.restaurantsService
      .getRestaurantsByQuery({
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
        res.send(data);
      })
      .catch((error) => {
        this.logger.error(`Error fetching restaurants:${error}`);
        res.status(500).send({ error: 'Internal Server Error' });
      });
  }

  async createRestaurant(req: Request, res: Response) {
    this.restaurantsService
      .createRestaurant(req.body)
      .then((data) => res.send(data))
      .catch((error) => {
        this.logger.error(`Error creating restaurant: ${error}`);
        res.status(500).send({ error: `Internal Server Error` });
      });
  }

  async deleteRestaurant(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send({ error: 'Restaurant ID is required' });
    }

    this.restaurantsService
      .deleteRestaurant(id)
      .then(() => res.status(204).send())
      .catch((error) => {
        this.logger.error(`Error deleting restaurant: ${error}`);
        res.status(500).send({ error: 'Internal Server Error' });
      });
  }

  async updateRestaurant(req: Request, res: Response) {
    const { id } = req.params;
    const data = req.body;

    if (!id) {
      return res.status(400).send({ error: 'Restaurant ID is required' });
    }

    this.restaurantsService
      .updateRestaurant(Number(id), data)
      .then(() => {
        res.status(200).send({ message: 'Restaurant updated successfully' });
      })
      .catch((error) => {
        this.logger.error(`Error updating restaurant: ${error}`);
        res.status(500).send({ error: 'Internal Server Error' });
      });
  }
}
