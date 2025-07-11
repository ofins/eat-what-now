import { Logger } from 'src/log/logger';
import { RestaurantsRepository } from './restaurants.repo';
import { Request, Response } from 'express';
import { RestaurantUserRepository } from '../restaurant-user/restaurant-user.repo';
import { CreateRestaurantUser } from './restaurants.schema';
import { searchGooglePlacesByText } from 'src/utils/google';

export class RestaurantsController {
  constructor(
    private readonly restaurantsRepository: RestaurantsRepository,
    private readonly restaurantUserRepository: RestaurantUserRepository,
    private readonly logger: Logger
  ) {
    this.getRestaurants = this.getRestaurants.bind(this);
    this.createRestaurant = this.createRestaurant.bind(this);
    this.deleteRestaurant = this.deleteRestaurant.bind(this);
    this.updateRestaurant = this.updateRestaurant.bind(this);
    this.addRestaurantUser = this.addRestaurantUser.bind(this);
    this.upvoteRestaurant = this.upvoteRestaurant.bind(this);
    this.searchGooglePlacesByText = this.searchGooglePlacesByText.bind(this);
  }

  async getRestaurants(req: Request, res: Response) {
    const {
      longitude,
      latitude,
      radius = 5,
      cuisineType,
      priceRange,
      minRating = 0,
      limit = 10,
      offset = 0,
    } = req.query;

    this.restaurantsRepository
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
        this.logger.error(`Error fetching restaurants:${error}`);
        res.status(500).send({ error: 'Internal Server Error' });
      });
  }

  async createRestaurant(req: Request, res: Response) {
    this.restaurantsRepository
      .createRestaurant(req.body)
      .then((data) => res.send(data))
      .catch((error) => {
        this.logger.error(`Error creating restaurant: ${error}`);
        res.status(500).send({ error: `Internal Server Error` });
      });
  }

  async deleteRestaurant(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send({ error: 'Restaurant ID is required' });
    }

    this.restaurantsRepository
      .deleteRestaurant(parseInt(id, 10))
      .then(() => res.status(204).send())
      .catch((error) => {
        this.logger.error(`Error deleting restaurant: ${error}`);
        res.status(500).send({ error: 'Internal Server Error' });
      });
  }

  async updateRestaurant(req: Request, res: Response) {
    const { id } = req.params;
    const data = req.body;

    if (!id) {
      return res.status(400).send({ error: 'Restaurant ID is required' });
    }

    this.restaurantsRepository
      .updateRestaurant(parseInt(id, 10), data)
      .then((data) => res.send(data))
      .catch((error) => {
        this.logger.error(`Error updating restaurant: ${error}`);
        res.status(500).send({ error: 'Internal Server Error' });
      });
  }

  async addRestaurantUser(req: Request, res: Response) {
    const data: CreateRestaurantUser = {
      user_id: req.body.user_id,
      restaurant_id: req.body.restaurant_id,
      upvoted: req.body.upvoted,
      downvoted: req.body.downvoted,
      favorited: req.body.favorited,
      rating: req.body.rating,
      comment: req.body.comment,
      visited_at: req.body.visited_at,
    };

    if (!data.user_id || !data.restaurant_id) {
      return res
        .status(400)
        .send({ error: 'User ID and Restaurant ID are required' });
    }

    this.restaurantUserRepository
      .addRelationship(data)
      .then((data) => res.send(data))
      .catch((error) => {
        this.logger.error(`Error adding relationship: ${error}`);
        res.status(500).send({ error: `Internal Server Error` });
      });
  }

  async upvoteRestaurant(req: Request, res: Response) {
    const { user_id, restaurant_id } = req.body;

    if (!user_id || !restaurant_id) {
      return res
        .status(400)
        .send({ error: 'User ID and Restaurant ID are required' });
    }

    this.restaurantUserRepository
      .toggleUpvote(user_id, restaurant_id)
      .then((data) => {
        this.restaurantsRepository.updateUpvoteCount(
          restaurant_id,
          data.upvoted ? 1 : -1
        );
      })
      .then((data) => res.send(data))
      .catch((error) => {
        this.logger.error(`Error toggling upvote: ${error}`);
        res.status(500).send({ error: 'Internal Server Error' });
      });
  }

  async searchGooglePlacesByText(req: Request, res: Response) {
    const { text, location } = req.body;

    if (!text || !location) {
      return res
        .status(400)
        .send({ error: 'Text, longitude, and latitude are required' });
    }

    try {
      const results = await searchGooglePlacesByText(text, location);
      res.send(results);
    } catch (error) {
      this.logger.error(`Error searching Google Places: ${error}`);
      res.status(500).send({ error: 'Internal Server Error' });
    }
  }
}
