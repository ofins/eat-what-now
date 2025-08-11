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

  async updateUpvote(req: Request, res: Response) {
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

  async updateFavorite(req: Request, res: Response) {
    try {
      const { userId, restaurantId, favorited } = req.body;
      const result = await this.restaurantUserService.toggleFavorite(
        restaurantId,
        userId,
        favorited
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to favorite restaurant' });
      this.logger.error(`Error favoriting restaurant: ${error}`);
    }
  }

  async updateComment(req: Request, res: Response) {
    try {
      const { userId, restaurantId, comment } = req.body;
      const result = await this.restaurantUserService.upsertComment(
        restaurantId,
        userId,
        comment
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to comment on restaurant' });
      this.logger.error(`Error commenting on restaurant: ${error}`);
    }
  }
}
