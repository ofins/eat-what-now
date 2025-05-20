import express from 'express';
import { container } from 'tsyringe';
import { FeedController } from './feed.controller';
import { authenticateAPIKey } from '../middleware/auth';

const router = express.Router();
const feedController = container.resolve(FeedController);

// /**
//  * @openapi
//  * /feed:
//  *   get:
//  *     tags:
//  *       - Restaurants
//  *     summary: Get a list of restaurants
//  *     security:
//  *       - ApiKeyAuth: []
//  *     parameters:
//  *       - in: query
//  *         name: longitude
//  *         schema:
//  *           type: integer
//  *         description: longitude
//  *       - in: query
//  *         name: latitude
//  *         schema:
//  *           type: integer
//  *         description: latitude
//  *       - in: query
//  *         name: radius
//  *         schema:
//  *           type: integer
//  *         description: default 5km
//  *       - in: query
//  *         name: cuisineType
//  *         schema:
//  *           type: integer
//  *         description: e.g. Italian
//  *       - in: query
//  *         name: priceRange
//  *         schema:
//  *           type: integer
//  *         description: price range from 1 to 5 (least to greatest)
//  *       - in: query
//  *         name: minRating
//  *         schema:
//  *           type: integer
//  *         description: range from 1 to 5 (least to greatest)
//  *       - in: query
//  *         name: limit
//  *         schema:
//  *           type: integer
//  *         description:
//  *       - in: query
//  *         name: offset
//  *         schema:
//  *           type: integer
//  *         description:
//  *     responses:
//  *       200:
//  *         description: A list of restaurants
//  */

// GET /feed
router.get('/', authenticateAPIKey, feedController.getRestaurants);

export default router;
