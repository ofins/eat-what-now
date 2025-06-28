import { NextFunction, Request, Response } from 'express';
import z from 'zod';

export const restaurantSchema = z.object({
  name: z.string().describe('Name of the restaurant'),
  latitude: z
    .number()
    .describe('Latitude coordinate of the restaurant location'),
  longitude: z
    .number()
    .describe('Longitude coordinate of the restaurant location'),
  image_url: z.string().url(),
  address: z.string().describe('Physical address of the restaurant'),
  website: z
    .string()
    .url()
    .optional()
    .describe('Website URL of the restaurant'),
  price_range: z
    .number()
    .int()
    .min(1)
    .max(5)
    .describe('Price range of the restaurant, from 1 to 5'),
  average_ratings: z
    .number()
    .min(0)
    .max(5)
    .describe('Average rating of the restaurant, from 0 to 5'),
  created_at: z.date().describe('Timestamp when the restaurant was created'),
  updated_at: z
    .date()
    .optional()
    .describe('Timestamp when the restaurant was last updated'),
  img_url: z.string().url().optional(),
  outbound_link: z.string().url().optional(),
});

export const restaurantFilterOptionsSchema = z.object({
  longitude: z.number().optional(),
  latitude: z.number().optional(),
  radius: z.number().optional(), // in kilometers
  priceRange: z.string().optional(),
  minRating: z.number().min(0).max(5).optional(),
  limit: z.coerce.number().int().min(1).max(100),
  offset: z.coerce.number().int().min(0).optional(),
});

export const createRestaurantSchema = z.object({
  name: z.string(),
  address: z.string(),
  rating: z.number().min(0).max(5).optional(),
  price_range: z.number().int().min(1).max(5),
  longitude: z.number(),
  latitude: z.number(),
  website: z.string().url().optional(),
  img_url: z.string().url().optional(),
  outbound_link: z.string().url().optional(),
  average_ratings: z.number().min(0).max(5).optional(),
});

export const updateRestaurantSchema = z.object({
  id: z.number().int(),
  data: createRestaurantSchema.partial(),
});

export const createRestaurantUserSchema = z.object({
  user_id: z.string().uuid(),
  restaurant_id: z.number().int(),
  upvoted: z.boolean().optional(),
  downvoted: z.boolean().optional(),
  favorited: z.boolean().optional(),
  rating: z.number().min(0).max(5).optional(),
  comment: z.string().optional(),
  visited_at: z.date().optional(),
});

export const validateRestaurantFilterOptionsSchema = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    restaurantFilterOptionsSchema.parse(req.query);
    next();
  } catch (error) {
    res.status(400).json({
      error: error instanceof z.ZodError ? error.errors : 'Invalid request',
    });
  }
};

export const validateCreateRestaurantSchema = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    createRestaurantSchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({
      error: error instanceof z.ZodError ? error.errors : 'Invalid request',
    });
  }
};

export const validateUpdateRestaurantSchema = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    updateRestaurantSchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({
      error: error instanceof z.ZodError ? error.errors : 'Invalid request',
    });
  }
};

export const validateCreateRestaurantUserSchema = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    createRestaurantUserSchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({
      error: error instanceof z.ZodError ? error.errors : 'Invalid request',
    });
  }
};

export type RestaurantFilterOptions = z.infer<
  typeof restaurantFilterOptionsSchema
>;
export type CreateRestaurant = z.infer<typeof createRestaurantSchema>;
export type UpdateRestaurant = z.infer<typeof updateRestaurantSchema>;
export type CreateRestaurantUser = z.infer<typeof createRestaurantUserSchema>;
