import { Request, Response } from 'express';
import { Logger } from 'src/log/logger';
import { RestaurantUserService } from 'src/services/restaurant-user.service';

export class RestaurantUserController {
  constructor(
    private readonly restaurantUserService: RestaurantUserService,
    private readonly logger: Logger
  ) {}

  async createRestaurantUser(req: Request, res: Response) {
    try {
      const restaurantUser = await this.restaurantUserService.addRestaurantUser(
        req.body
      );
      res.status(201).json(restaurantUser);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create restaurant user' });
      this.logger.error(`Error creating restaurant user: ${error}`);
    }
  }

  async setUpvote(req: Request, res: Response) {
    try {
      const { userId, restaurantId, upvoted } = req.body;
      const result = await this.restaurantUserService.toggleUpvote(
        restaurantId,
        userId,
        upvoted
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to upvote restaurant' });
      this.logger.error(`Error upvoting restaurant: ${error}`);
    }
  }
}
