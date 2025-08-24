import { AuthRequest } from '@ewn/types/auth.type';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { Logger } from 'src/log/logger';
import { AuthService } from 'src/services/auth.service';
import { UsersService } from '../services/users.service';

export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly logger: Logger
  ) {
    this.getUsers = this.getUsers.bind(this);
    this.getUserProfile = this.getUserProfile.bind(this);
    this.login = this.login.bind(this);
    this.registerUser = this.registerUser.bind(this);
  }

  async getUsers(req: Request, res: Response) {
    const { limit, offset } = req.query;

    try {
      const data = await this.usersService.findAllUsers({
        limit: parseFloat(limit as string),
        offset: parseFloat(offset as string),
      });
      res.send(data);
    } catch (error) {
      this.logger.error(`Error fetching users: ${error}`);
      res.status(500).send({ error: 'Internal Server Error' });
    }
  }

  async getUserProfile(req: Request, res: Response) {
    const userId = (req as AuthRequest).userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    try {
      const user = await this.usersService.findUserById(userId);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.json({ data: user });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required.' });
      return;
    }

    this.usersService
      .findUserByEmail(email)
      .then((user) => {
        if (!user || !user.password_hash) {
          res.status(401).json({ error: 'Invalid credentials' });
          return;
        }

        return bcrypt.compare(password, user.password_hash).then((valid) => {
          if (!valid) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
          }
          const token = this.authService.signToken({ user_id: user.id });
          res.json({
            data: {
              id: user.id,
              email: user.email,
              username: user.username,
              full_name: user.full_name,
              is_active: user.is_active,
              is_verified: user.is_verified,
              created_at: user.created_at,
              updated_at: user.updated_at,
            },
            token,
          });
        });
      })
      .catch((error) => {
        this.logger.error('Login error:', error as never);
        res.status(500).json({ error: 'Internal server error' });
      });
  }

  async registerUser(req: Request, res: Response): Promise<void> {
    try {
      const { email, username, password, full_name } = req.body;

      if (!email || !username || !password) {
        res.status(400).json({ error: 'Missing info' });
        return;
      }

      const [existingUserByEmail, existingUserByUsername] = await Promise.all([
        this.usersService.findUserByEmail(email),
        this.usersService.findUserByUsername(username),
      ]);

      if (existingUserByEmail) {
        res.status(400).json({ error: 'Email already exists' });
        return;
      }

      if (existingUserByUsername) {
        res.status(400).json({ error: 'Username already exists' });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await this.usersService.createUser({
        email,
        username,
        password_hash: hashedPassword,
        full_name,
      });

      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      this.logger.error('Registration error:', error as never);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
