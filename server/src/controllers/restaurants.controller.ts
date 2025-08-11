import { AuthRequest } from '@ewn/types/auth.type';
import { Request, Response } from 'express';
import { Logger } from 'src/log/logger';
import { RestaurantsService } from 'src/services/restaurants.service';
export class RestaurantsController {
  constructor(
    private readonly restaurantsService: RestaurantsService,
    private readonly logger: Logger
  ) {}

  async getRestaurants(req: Request, res: Response) {
    const userId = (req as AuthRequest).userId;

    this.restaurantsService
      .getRestaurantsByQueryOptionalUserId(userId, req.query)
      .then((data) => res.send(data))
      .catch((error) => {
        this.logger.error(
          `Error fetching restaurants with user ID ${userId}: ${error}`
        );
        res.status(500).send({ error: 'Internal Server Error' });
      });
    return;
  }

  async getRestaurantsWithUserRelation(req: Request, res: Response) {
    const userId = (req as AuthRequest).userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    this.restaurantsService
      .getRestaurantsByQueryOptionalUserId(userId, req.query)
      .then((data) => res.send(data))
      .catch((error) => {
        this.logger.error(
          `Error fetching restaurants with user ID ${userId}: ${error}`
        );
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
