import express, { Request, Response } from 'express';
import { UsersRepository } from 'src/db/users/users.repo';
import { authenticateAPIKey } from 'src/middleware/auth';

const router = express.Router();

const usersRepository = new UsersRepository();

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

export default router;
