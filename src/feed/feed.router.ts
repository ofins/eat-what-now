import express from 'express';
import Restaurant from '../db/restaurant';

const router = express.Router();

const restaurant = new Restaurant();

router.get('/', (req, res) => {
  const { lon, lat } = req.query;

  // query based on location
  restaurant
    .getRestaurants(lon as string, lat as string)
    .then((data) => res.send({ data }))
    .catch((error) => {
      console.log(`Error fetching restaurants:${error}`);
      res.status(500).send({ error: 'Internal Server Error' });
    });
});

export default router;
