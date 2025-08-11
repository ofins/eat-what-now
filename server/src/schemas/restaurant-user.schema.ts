import { NextFunction, Request, Response } from 'express';
import z from 'zod';

export const updateRelationSchema = z.object({
  userId: z.string().uuid().describe('UUID of the user'),
  restaurantId: z.number().describe('ID of the restaurant'),
  upvoted: z
    .boolean()
    .optional()
    .describe('Whether the restaurant is upvoted or not'),
  favorited: z
    .boolean()
    .optional()
    .describe('Whether the restaurant is favorited or not'),
  commented: z.string().max(500).optional().describe('Comment text'),
});

export const validateRestaurantUserRelationSchema = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    updateRelationSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Invalid request data',
        details: error.errors,
      });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};
