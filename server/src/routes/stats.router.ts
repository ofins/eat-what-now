import express, { Request, Response } from 'express';
import { db } from '../config';
import client, { getCachedData, setCachedData } from 'src/redis';
import logger from '../log/logger';

const router = express.Router();

/**
 * @swagger
 * /stats/mismatch:
 *   get:
 *     summary: Find restaurants without users or users without restaurants
 *     description: Performs a full outer join to identify orphaned records between restaurants and users based on contributor_username
 *     tags: [Stats]
 *     responses:
 *       200:
 *         description: Successfully retrieved mismatch data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       restaurant_id:
 *                         type: integer
 *                         example: 123
 *                       name:
 *                         type: string
 *                         example: "Pizza Palace"
 *                       username:
 *                         type: string
 *                         nullable: true
 *                         example: "john_doe"
 *                 count:
 *                   type: integer
 *                   example: 5
 *       500:
 *         description: Internal server error
 */
router.get('/mismatch', async (req: Request, res: Response) => {
  const cacheKey = 'stats:mismatch';

  try {
    const cachedResult = await getCachedData(cacheKey);
    if (cachedResult) {
      res.json(cachedResult);
      return;
    }

    const data = await db('restaurants')
      .fullOuterJoin(
        'users',
        'restaurants.contributor_username',
        'users.username'
      )
      .select(
        'restaurants.id as restaurant_id',
        'restaurants.name',
        'users.username'
      )
      .whereNull('users.username')
      .orWhereNull('restaurants.contributor_username');

    const result = {
      success: true,
      data,
      count: data.length,
    };

    await setCachedData(cacheKey, result, 1800);

    res.json(result);
  } catch (error) {
    logger.error('Error in mismatch endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
    });
  }
});

/**
 * @swagger
 * /stats/users-empty:
 *   get:
 *     summary: Get users not assigned to any restaurant
 *     description: Returns a list of users who are not assigned to any restaurant using left join
 *     tags: [Stats]
 *     responses:
 *       200:
 *         description: Successfully retrieved unassigned users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       username:
 *                         type: string
 *                         example: "jane_doe"
 *                       email:
 *                         type: string
 *                         example: "jane@example.com"
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-01-01T00:00:00.000Z"
 *                 count:
 *                   type: integer
 *                   example: 3
 *       500:
 *         description: Internal server error
 */
router.get('/users-empty', async (req, res) => {
  const cacheKey = 'stats:users-empty';

  try {
    const cachedResult = await getCachedData(cacheKey);
    if (cachedResult) {
      res.json(cachedResult);
      return;
    }

    const data = await db('users')
      .leftJoin('restaurant_user', 'users.id', 'restaurant_user.user_id')
      .select('users.*')
      .whereNull('restaurant_user.user_id');

    const result = {
      success: true,
      data,
      count: data.length,
    };

    await setCachedData(cacheKey, result, 900);

    res.json(result);
  } catch (error) {
    logger.error('Error in users-empty endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
    });
  }
});

/**
 * @swagger
 * /stats/users-assigned:
 *   get:
 *     summary: Get users with their assigned restaurants
 *     description: Returns users with an aggregated list of restaurant IDs they are assigned to
 *     tags: [Stats]
 *     responses:
 *       200:
 *         description: Successfully retrieved users with restaurant assignments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       username:
 *                         type: string
 *                         example: "john_doe"
 *                       email:
 *                         type: string
 *                         example: "john@example.com"
 *                       restaurants:
 *                         type: array
 *                         items:
 *                           type: integer
 *                         example: [1, 2, 3]
 *                         description: Array of restaurant IDs assigned to this user
 *                 count:
 *                   type: integer
 *                   example: 10
 *       500:
 *         description: Internal server error
 */
router.get('/users-assigned', async (req, res) => {
  const cacheKey = 'stats:users-assigned';

  try {
    const cachedResult = await getCachedData(cacheKey);
    if (cachedResult) {
      res.json(cachedResult);
      return;
    }

    const data = await db('users')
      .leftJoin('restaurant_user', 'users.id', 'restaurant_user.user_id')
      .select('users.*')
      .select(db.raw('json_agg(restaurant_user.restaurant_id) as restaurants'))
      .groupBy('users.id', 'users.username');

    const result = {
      success: true,
      data,
      count: data.length,
    };

    await setCachedData(cacheKey, result, 600);

    res.json(result);
  } catch (error) {
    logger.error('Error in users-assigned endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
    });
  }
});

// Cache invalidation endpoint (useful for admin operations)
/**
 * @swagger
 * /stats/clear-cache:
 *   delete:
 *     summary: Clear all stats cache
 *     description: Clears all cached statistics data
 *     tags: [Stats]
 *     responses:
 *       200:
 *         description: Cache cleared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Stats cache cleared successfully"
 *                 cleared_keys:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["stats:mismatch", "stats:users-empty", "stats:users-assigned"]
 *       500:
 *         description: Internal server error
 */
router.delete('/clear-cache', async (req, res) => {
  try {
    const cacheKeys = [
      'stats:mismatch',
      'stats:users-empty',
      'stats:users-assigned',
    ];

    const deletePromises = cacheKeys.map((key) => client.del(key));
    await Promise.all(deletePromises);

    logger.info('Stats cache cleared manually');

    res.json({
      success: true,
      message: 'Stats cache cleared successfully',
      cleared_keys: cacheKeys,
    });
  } catch (error) {
    logger.error('Error clearing stats cache:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear cache',
    });
  }
});

router.get('/inner-join', () => {});

export default router;

/**
 * @swagger
 * /stats/mismatch:
 *   get:
 *     summary: Find restaurants without users or users without restaurants
 *     description: Performs a full outer join to identify orphaned records between restaurants and users based on contributor_username
 *     tags: [Stats]
 *     responses:
 *       200:
 *         description: Successfully retrieved mismatch data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       restaurant_id:
 *                         type: integer
 *                         example: 123
 *                       name:
 *                         type: string
 *                         example: "Pizza Palace"
 *                       username:
 *                         type: string
 *                         nullable: true
 *                         example: "john_doe"
 *                 count:
 *                   type: integer
 *                   example: 5
 *       500:
 *         description: Internal server error
 *
 * /stats/users-empty:
 *   get:
 *     summary: Get users not assigned to any restaurant
 *     description: Returns a list of users who are not assigned to any restaurant using left join
 *     tags: [Stats]
 *     responses:
 *       200:
 *         description: Successfully retrieved unassigned users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       username:
 *                         type: string
 *                         example: "jane_doe"
 *                       email:
 *                         type: string
 *                         example: "jane@example.com"
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-01-01T00:00:00.000Z"
 *                 count:
 *                   type: integer
 *                   example: 3
 *       500:
 *         description: Internal server error
 *
 * /stats/users-assigned:
 *   get:
 *     summary: Get users with their assigned restaurants
 *     description: Returns users with an aggregated list of restaurant IDs they are assigned to
 *     tags: [Stats]
 *     responses:
 *       200:
 *         description: Successfully retrieved users with restaurant assignments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       username:
 *                         type: string
 *                         example: "john_doe"
 *                       email:
 *                         type: string
 *                         example: "john@example.com"
 *                       restaurants:
 *                         type: array
 *                         items:
 *                           type: integer
 *                         example: [1, 2, 3]
 *                         description: Array of restaurant IDs assigned to this user
 *                 count:
 *                   type: integer
 *                   example: 10
 *       500:
 *         description: Internal server error
 *
 * /stats/clear-cache:
 *   delete:
 *     summary: Clear all stats cache
 *     description: Clears all cached statistics data
 *     tags: [Stats]
 *     responses:
 *       200:
 *         description: Cache cleared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Stats cache cleared successfully"
 *                 cleared_keys:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["stats:mismatch", "stats:users-empty", "stats:users-assigned"]
 *       500:
 *         description: Internal server error
 *
 * /stats/inner-join:
 *   get:
 *     summary: Perform inner join operation (placeholder)
 *     description: Placeholder endpoint for inner join statistics
 *     tags: [Stats]
 *     responses:
 *       501:
 *         description: Not implemented
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Endpoint not implemented yet"
 *
 * components:
 *   schemas:
 *     StatsResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Indicates if the request was successful
 *         data:
 *           type: array
 *           description: Array of result objects
 *         count:
 *           type: integer
 *           description: Number of records returned
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         error:
 *           type: string
 *           description: Error message
 *   tags:
 *     - name: Stats
 *       description: Statistical operations and database joins for analyzing data relationships
 */
