import { NextFunction, Request, Response } from 'express';
import z from 'zod';

export const upvoteSchema = z.object({
  userId: z.string().uuid().describe('UUID of the user'),
  restaurantId: z.number().describe('ID of the restaurant'),
  upvoted: z.boolean().describe('Whether the restaurant is upvoted or not'),
});

export const validateUpvoteSchema = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    upvoteSchema.parse(req.body);
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
