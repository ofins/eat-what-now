/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Request, Response } from 'express';
import { signToken } from 'src/middleware/auth';
import { usersRepository } from 'src/server';
import bcrypt from 'bcrypt';

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
        const token = signToken({ id: user.id, email: user.email });
        res.json({ token });
      });
    })
    .catch((error) => {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

router.post('/register', (req: Request, res: Response): any => {
  const { email, username, password, full_name } = req.body;

  if (!email || !username || !password || !full_name) {
    return res.status(400).json({
      error: 'Missing info',
    });
  }

  // hash password

  usersRepository.getUserByEmail(email).then((user) => {
    if (user) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    bcrypt.hash(password, 10).then((passwordHash) => {
      usersRepository.createUser({
        email,
        password_hash: passwordHash,
        full_name,
        avatar_url: '',
        is_active: true,
        is_verified: false,
        id: '',
        username: '',
        created_at: new Date(),
        updated_at: new Date(),
      });
    });
  });
});

export default router;
