import express, { Request, Response } from 'express';
import {
  CreateRestaurantUser,
  validateCreateRestaurantSchema,
  validateCreateRestaurantUserSchema,
  validateUpdateRestaurantSchema,
} from 'src/db/restaurants/restaurants.schema';
import logger from 'src/log/logger';
import { authenticateAPIKey } from 'src/middleware/auth';
import { restaurantRepository, restaurantUserRepository } from 'src/server';
import { searchGooglePlacesByText } from 'src/utils/google';

const router = express.Router();

router.post(
  '/',
  authenticateAPIKey,
  validateCreateRestaurantSchema,
  (req: Request, res: Response) => {
    restaurantRepository
      .createRestaurant(req.body)
      .then((data) => res.send(data))
      .catch((error) => {
        logger.error(`Error creating restaurant: ${error}`);
        res.status(500).send({ error: `Internal Server Error` });
      });
  }
);

router.put(
  '/:id',
  authenticateAPIKey,
  validateUpdateRestaurantSchema,
  (req: Request, res: Response) => {
    const { id } = req.params;
    restaurantRepository
      .updateRestaurant(Number(id), req.body.data)
      .then((data) => res.send(data))
      .catch((error) => {
        logger.error(`Error updating restaurant: ${error}`);
        res.status(500).send({ error: `Internal Server Error` });
      });
  }
);

router.delete('/:id', authenticateAPIKey, (req: Request, res: Response) => {
  const { id } = req.params;
  restaurantRepository
    .deleteRestaurant(Number(id))
    .then((data) => res.send(data))
    .catch((error) => {
      logger.error(`Error deleting restaurant: ${error}`);
      res.status(500).send({ error: `Internal Server Error` });
    });
});

router.post(
  '/user',
  authenticateAPIKey,
  validateCreateRestaurantUserSchema,
  (req: Request, res: Response) => {
    const data: CreateRestaurantUser = {
      user_id: req.body.user_id,
      restaurant_id: req.body.restaurant_id,
      upvoted: req.body.upvoted,
      downvoted: req.body.downvoted,
      favorited: req.body.favorited,
      rating: req.body.rating,
      comment: req.body.comment,
      visited_at: req.body.visited_at,
    };

    restaurantUserRepository
      .addRelationship(data)
      .then((data) => res.send(data))
      .catch((error) => {
        logger.error(`Error adding relationship: ${error}`);
        res.status(500).send({ error: `Internal Server Error` });
      });
  }
);

router.post(
  '/user/upvote',
  authenticateAPIKey,
  async (req: Request, res: Response) => {
    const { user_id, restaurant_id } = req.body;

    try {
      const updatedData = await restaurantUserRepository.toggleUpvote(
        user_id,
        restaurant_id
      );

      // Fast update the restaurant's upvote count
      await restaurantRepository.updateUpvoteCount(
        restaurant_id,
        updatedData.upvoted ? 1 : -1
      );

      res.send(updatedData);
    } catch (error) {
      logger.error(`Error toggling upvote: ${error}`);
      res.status(500).send({ error: `Internal Server Error` });
    }
  }
);

router.post(
  '/google/search-by-text',
  authenticateAPIKey,
  async (req: Request, res: Response) => {
    const { text, location } = req.body;

    try {
      const results = await searchGooglePlacesByText(text, location);
      res.send(results);
    } catch (error) {
      logger.error(`Error searching restaurants by text: ${error}`);
      res.status(500).send({ error: `Internal Server Error` });
    }
  }
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
