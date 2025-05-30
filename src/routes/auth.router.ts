/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from 'bcrypt';
import express, { Request, Response } from 'express';
import { validateCreateUser } from 'src/db/users/users.schema';
import { signToken } from 'src/middleware/auth';
import { usersRepository } from 'src/server';

const router = express.Router();

router.post('/login', (req: Request, res: Response): any => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  usersRepository
    .getUserByEmail(email)
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      return bcrypt.compare(password, user.password_hash).then((valid) => {
        if (!valid) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = signToken({ email: user.email });
        res.json({
          data: {
            user,
            token,
          },
        });
      });
    })
    .catch((error) => {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

router.post(
  '/register',
  validateCreateUser,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, username, password, full_name } = req.body;

      if (!email || !username || !password) {
        res.status(400).json({ error: 'Missing info' });
        return;
      }

      const user = await usersRepository.getUserByEmail(email);
      if (user) {
        res.status(409).json({ error: 'Email already registered' });
        return;
      }

      const passwordHash = await bcrypt.hash(password, 10);
      await usersRepository.createUser({
        email,
        username,
        password_hash: passwordHash,
        full_name,
      });

      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default router;
