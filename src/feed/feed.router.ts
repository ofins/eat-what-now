import express from 'express';
import { RestaurantService } from 'src/db/restaurant/restaurant.service';
import { authenticateAPIKey } from '../middleware/auth';
import { FeedController } from './feed.controller';

const router = express.Router();

const restaurantService = new RestaurantService();

const feedController = new FeedController(restaurantService);
router.get(
  '/',
  authenticateAPIKey,
  feedController.getRestaurants.bind(feedController)
);

export default router;
