import express from 'express';
import {
  validateCreateUser,
  validateUserLogin,
} from 'src/db/users/users.schema';
import { container } from 'src/di/di.container';
import { InjectionTokens } from 'src/di/injections-token.enum';

const router = express.Router();

const usersController = container.resolve(InjectionTokens.usersController);
// console.log(usersController, 'usersController');
router.post(
  '/login',
  validateUserLogin,
  usersController.login.bind(usersController)
);

router.post(
  '/register',
  validateCreateUser,
  usersController.registerUser.bind(usersController)
);

export default router;

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticates a user and returns a JWT token.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful, returns user and JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/UserLoginSchema'
 *                     token:
 *                       type: string
 *       400:
 *         description: Missing email or password
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 *
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - username
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               username:
 *                 type: string
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 example: password123
 *               full_name:
 *                 type: string
 *                 example: John Doe
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Missing or invalid registration info
 *       409:
 *         description: Email already registered
 *       500:
 *         description: Internal server error
 */
