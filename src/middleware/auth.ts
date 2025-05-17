import { NextFunction, Request, Response } from 'express';

import dotenv from 'dotenv';
dotenv.config();

const signature = process.env.SIGNATURE;

export const authenticateAPIKey = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const providedKey = req.header('x-signature');

  if (!providedKey) {
    res.status(401).json({ error: 'Invalid.' });
    return;
  }

  if (providedKey !== signature) {
    res.status(403).json({ error: 'Invalid.' });
    return;
  }

  next();
};
