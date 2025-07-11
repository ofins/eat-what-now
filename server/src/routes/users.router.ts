import express from 'express';
import { container } from 'src/di/di.container';
import { InjectionTokens } from 'src/di/injections-token.enum';
import { authenticateAPIKey, authenticateToken } from 'src/middleware/auth';

const router = express.Router();

const usersController = container.resolve(InjectionTokens.usersController);

// * Internal
router.get(
  '/',
  authenticateAPIKey,
  usersController.getUsers.bind(usersController)
);

// * Public
router.get(
  '/profile',
  authenticateToken,
  usersController.getUserProfile.bind(usersController)
);

export default router;

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (internal)
 *     description: Returns a paginated list of all users. Requires API key authentication.
 *     tags:
 *       - Users
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         required: false
 *         description: Number of users to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: number
 *         required: false
 *         description: Number of users to skip
 *     responses:
 *       200:
 *         description: A paginated list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserFilterOptionsSchema'
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
 *
 * /users/profile:
 *   get:
 *     summary: Get current user's profile
 *     description: Returns the profile of the currently authenticated user. Requires Bearer token authentication.
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
