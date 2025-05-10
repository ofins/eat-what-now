import express from 'express';
import { RestaurantService } from '../db/restaurant';

const router = express.Router();

const restaurant = new RestaurantService();

router.get('/', (req, res) => {
  const { lon, lat } = req.query;

  // query based on location
  restaurant
    .getRestaurants({
      longitude: lon as unknown as number,
      latitude: lat as unknown as number,
    })
    .then((data) => res.send({ data }))
    .catch((error) => {
      console.log(`Error fetching restaurants:${error}`);
      res.status(500).send({ error: 'Internal Server Error' });
    });
});

export default router;
