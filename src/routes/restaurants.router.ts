import express, { Request, Response } from 'express';
import { CreateRestaurantUserData } from 'src/db/restaurant-user/restaurant-user.repo';
import { authenticateAPIKey } from 'src/middleware/auth';
import { restaurantRepository, restaurantUserRepository } from 'src/server';

const router = express.Router();

router.post('/', authenticateAPIKey, (req: Request, res: Response) => {
  restaurantRepository
    .createRestaurant(req.body)
    .then((data) => res.send(data))
    .catch((error) => {
      console.log(`Error creating restaurant: ${error}`);
      res.status(500).send({ error: `Internal Server Error` });
    });
});

router.put('/:id', authenticateAPIKey, (req: Request, res: Response) => {
  const { id } = req.params;
  restaurantRepository
    .updateRestaurant(Number(id), req.body)
    .then((data) => res.send(data))
    .catch((error) => {
      console.log(`Error updating restaurant: ${error}`);
      res.status(500).send({ error: `Internal Server Error` });
    });
});

router.delete('/:id', authenticateAPIKey, (req: Request, res: Response) => {
  const { id } = req.params;
  restaurantRepository
    .deleteRestaurant(Number(id))
    .then((data) => res.send(data))
    .catch((error) => {
      console.log(`Error deleting restaurant: ${error}`);
      res.status(500).send({ error: `Internal Server Error` });
    });
});

router.post('/user', authenticateAPIKey, (req: Request, res: Response) => {
  const data: CreateRestaurantUserData = {
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
      console.log(`Error adding relationship: ${error}`);
      res.status(500).send({ error: `Internal Server Error` });
    });
});

export default router;
