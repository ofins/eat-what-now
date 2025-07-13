import express from 'express';
import {
  validateCreateRestaurantSchema,
  validateCreateRestaurantUserSchema,
  validateUpdateRestaurantSchema,
} from 'src/db/restaurants/restaurants.schema';
import { container } from 'src/di/di.container';
import { InjectionTokens } from 'src/di/enum/injections-token.enum';
import { authenticateAPIKey } from 'src/middleware/auth';

const router = express.Router();

const restaurantsController = container.resolve(
  InjectionTokens.restaurantsController
);

router.post(
  '/',
  authenticateAPIKey,
  validateCreateRestaurantSchema,
  restaurantsController.createRestaurant.bind(restaurantsController)
);

router.put(
  '/:id',
  authenticateAPIKey,
  validateUpdateRestaurantSchema,
  restaurantsController.updateRestaurant.bind(restaurantsController)
);

router.delete(
  '/:id',
  authenticateAPIKey,
  restaurantsController.deleteRestaurant.bind(restaurantsController)
);

router.post(
  '/user',
  authenticateAPIKey,
  validateCreateRestaurantUserSchema,
  restaurantsController.addRestaurantUser.bind(restaurantsController)
);

router.post(
  '/user/upvote',
  authenticateAPIKey,
  restaurantsController.upvoteRestaurant.bind(restaurantsController)
);

router.post(
  '/google/search-by-text',
  authenticateAPIKey,
  restaurantsController.searchGooglePlacesByText.bind(restaurantsController)
);

export default router;

/**
 * @swagger
 * /restaurants:
 *   post:
 *     summary: Create a new restaurant
 *     description: Creates a new restaurant. Requires API key authentication.
 *     tags:
 *       - Restaurants
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRestaurantSchema'
 *     responses:
 *       200:
 *         description: Restaurant created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 *
 * /restaurants/{id}:
 *   put:
 *     summary: Update a restaurant
 *     description: Updates a restaurant by ID. Requires API key authentication.
 *     tags:
 *       - Restaurants
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Restaurant ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateRestaurantSchema'
 *     responses:
 *       200:
 *         description: Restaurant updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Restaurant not found
 *       500:
 *         description: Internal Server Error
 *   delete:
 *     summary: Delete a restaurant
 *     description: Deletes a restaurant by ID. Requires API key authentication.
 *     tags:
 *       - Restaurants
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Restaurant ID
 *     responses:
 *       200:
 *         description: Restaurant deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Restaurant not found
 *       500:
 *         description: Internal Server Error
 *
 * /restaurants/user:
 *   post:
 *     summary: Add or update user-restaurant relationship
 *     description: Adds or updates a relationship between a user and a restaurant (e.g., upvote, favorite, comment). Requires API key authentication.
 *     tags:
 *       - Restaurants
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
 * /restaurants/user/upvote:
 *   post:
 *     summary: Toggle upvote for a restaurant by user
 *     description: Toggles the upvote status for a restaurant by a user. Requires API key authentication.
 *     tags:
 *       - Restaurants
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: User ID
 *               restaurant_id:
 *                 type: integer
 *                 description: Restaurant ID
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
 * /restaurants/google/search-by-text:
 *   post:
 *     summary: Search restaurants by text using Google Places API
 *     description: Searches for restaurants by text query and location using Google Places API. Returns restaurant data including name, address, price level, photos, and routing information.
 *     tags:
 *       - Restaurants
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *               - location
 *             properties:
 *               text:
 *                 type: string
 *                 description: Search query text (e.g., restaurant name, cuisine type)
 *                 example: "starbucks"
 *               location:
 *                 type: object
 *                 required:
 *                   - latitude
 *                   - longitude
 *                 properties:
 *                   latitude:
 *                     type: number
 *                     format: double
 *                     description: Latitude coordinate for search origin
 *                     example: 25.0396385
 *                   longitude:
 *                     type: number
 *                     format: double
 *                     description: Longitude coordinate for search origin
 *                     example: 121.5310953
 *     responses:
 *       200:
 *         description: Search results returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 places:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: Google Place ID
 *                       displayName:
 *                         type: object
 *                         properties:
 *                           text:
 *                             type: string
 *                             description: Restaurant name
 *                           languageCode:
 *                             type: string
 *                             description: Language code
 *                       formattedAddress:
 *                         type: string
 *                         description: Full formatted address
 *                       priceLevel:
 *                         type: string
 *                         enum: [PRICE_LEVEL_FREE, PRICE_LEVEL_INEXPENSIVE, PRICE_LEVEL_MODERATE, PRICE_LEVEL_EXPENSIVE, PRICE_LEVEL_VERY_EXPENSIVE]
 *                         description: Price range indicator
 *                       photos:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             name:
 *                               type: string
 *                               description: Photo reference name
 *                             widthPx:
 *                               type: integer
 *                               description: Photo width in pixels
 *                             heightPx:
 *                               type: integer
 *                               description: Photo height in pixels
 *                 routingSummaries:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       legs:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             duration:
 *                               type: string
 *                               description: Travel duration (e.g., "300s")
 *                             distanceMeters:
 *                               type: integer
 *                               description: Distance in meters
 *                       directionsUri:
 *                         type: string
 *                         description: Google Maps directions URL
 *       400:
 *         description: Invalid input - missing required fields or invalid coordinates
 *       401:
 *         description: Unauthorized - invalid or missing API key
 *       500:
 *         description: Internal Server Error - Google Places API error or server issue
 */
