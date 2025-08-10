import express from 'express';
import { container } from 'src/di/di.container';
import { InjectionTokens } from 'src/di/enum/injections-token.enum';
import { validateRestaurantFilterOptionsSchema } from 'src/schemas/restaurants.schema';

const router = express.Router();

const restaurantsController = container.resolve(
  InjectionTokens.restaurantsController
);

router.get(
  '/',
  validateRestaurantFilterOptionsSchema,
  restaurantsController.getRestaurants.bind(restaurantsController)
);

export default router;

/**
 * @swagger
 * /feed:
 *   get:
 *     summary: Get restaurants feed
 *     description: Returns a paginated list of restaurants for the daily feed, filtered by location and other criteria.
 *     tags:
 *       - Feed
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: longitude
 *         schema:
 *           type: number
 *         required: false
 *         description: Longitude for location-based search
 *       - in: query
 *         name: latitude
 *         schema:
 *           type: number
 *         required: false
 *         description: Latitude for location-based search
 *       - in: query
 *         name: radius
 *         schema:
 *           type: number
 *         required: false
 *         description: Search radius in kilometers
 *       - in: query
 *         name: cuisineType
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter by cuisine type
 *       - in: query
 *         name: priceRange
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter by price range
 *       - in: query
 *         name: minRating
 *         schema:
 *           type: number
 *         required: false
 *         description: Minimum rating
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         required: false
 *         description: Number of results to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: number
 *         required: false
 *         description: Number of results to skip
 *     responses:
 *       200:
 *         description: A paginated list of restaurants
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/RestaurantSchema'
 *                 total:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 offset:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
