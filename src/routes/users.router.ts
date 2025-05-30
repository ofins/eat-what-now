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
router.get('/:id', authenticateToken, () => {});

export default router;
