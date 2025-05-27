import express, { Request, Response } from 'express';
import { RestaurantsRepository } from 'src/db/restaurant/restaurant.repo';
import { authenticateAPIKey } from '../middleware/auth';

const router = express.Router();

const restaurantRepository = new RestaurantsRepository();

router.get('/', authenticateAPIKey, (req: Request, res: Response) => {
  const {
    longitude,
    latitude,
    radius,
    cuisineType,
    priceRange,
    minRating,
    limit,
    offset,
  } = req.query;

  restaurantRepository
    .getRestaurants({
      longitude: parseFloat(longitude as string),
      latitude: parseFloat(latitude as string),
      radius: parseFloat(radius as string), // Default 5km radius
      cuisineType: typeof cuisineType === 'string' ? cuisineType : undefined,
      priceRange: priceRange === 'string' ? priceRange : undefined,
      minRating: parseFloat(minRating as string),
      limit: parseFloat(limit as string),
      offset: parseFloat(offset as string),
    })
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      console.log(`Error fetching restaurants:${error}`);
      res.status(500).send({ error: 'Internal Server Error' });
    });
});

export default router;
