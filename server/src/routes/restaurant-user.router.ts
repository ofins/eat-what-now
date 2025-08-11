import express from 'express';
import { validateRestaurantUserRelationSchema } from 'src/schemas/restaurant-user.schema';
import { validateCreateRestaurantUserSchema } from 'src/schemas/restaurants.schema';

import { container } from 'src/di/di.container';
import { InjectionTokens } from 'src/di/enum/injections-token.enum';
import { authenticateAPIKey } from 'src/middleware/auth';

const router = express.Router();

const restaurantUserController = container.resolve(
  InjectionTokens.restaurantUserController
);

router.post(
  '/',
  authenticateAPIKey,
  validateCreateRestaurantUserSchema,
  restaurantUserController.createRestaurantUser.bind(restaurantUserController)
);

router.post(
  '/upvote',
  authenticateAPIKey,
  validateRestaurantUserRelationSchema,
  restaurantUserController.updateUpvote.bind(restaurantUserController)
);

router.post(
  '/favorite',
  authenticateAPIKey,
  validateRestaurantUserRelationSchema,
  restaurantUserController.updateFavorite.bind(restaurantUserController)
);

export default router;

/**
 * @swagger
 * /restaurant-user:
 *   post:
 *     summary: Add or update user-restaurant relationship
 *     description: Adds or updates a relationship between a user and a restaurant (e.g., upvote, favorite, comment). Requires API key authentication.
 *     tags:
 *       - RestaurantUser
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRestaurantUserSchema'
 *     responses:
 *       200:
 *         description: Relationship added/updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 *
 * /restaurant-user/upvote:
 *   post:
 *     summary: Toggle upvote for a restaurant by user
 *     description: Toggles the upvote status for a restaurant by a user. Requires API key authentication.
 *     tags:
 *       - RestaurantUser
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: User ID
 *               restaurantId:
 *                 type: integer
 *                 description: Restaurant ID
 *               upvoted:
 *                 type: boolean
 *                 description: Upvote status
 *     responses:
 *       200:
 *         description: Upvote toggled successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Restaurant not found
 *       500:
 *         description: Internal Server Error
 *
 * /restaurant-user/favorite:
 *   post:
 *     summary: Toggle favorite for a restaurant by user
 *     description: Toggles the favorite status for a restaurant by a user. Requires API key authentication.
 *     tags:
 *       - RestaurantUser
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: User ID
 *               restaurantId:
 *                 type: integer
 *                 description: Restaurant ID
 *               favorited:
 *                 type: boolean
 *                 description: Favorite status
 *     responses:
 *       200:
 *         description: Favorite toggled successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Restaurant not found
 *       500:
 *         description: Internal Server Error
 */
