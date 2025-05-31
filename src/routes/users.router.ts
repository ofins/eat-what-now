import express, { Request, Response } from 'express';
import { authenticateAPIKey, authenticateToken } from 'src/middleware/auth';
import { usersRepository } from 'src/server';

const router = express.Router();

// * Internal
router.get('/', authenticateAPIKey, (req: Request, res: Response) => {
  const { limit, offset } = req.query;

  usersRepository
    .getUsers({
      limit: parseFloat(limit as string),
      offset: parseFloat(offset as string),
    })
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      console.log(`Error fetching users:${error}`);
      res.status(500).send({ error: 'Internal Server Error' });
    });
});

// * Public
router.get('/profile', authenticateToken, (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (req as any).userId;
  console.log(userId);

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  usersRepository
    .getUserById(userId)
    .then((user) => {
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.json({ data: user });
    })
    .catch((error) => {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

export default router;
