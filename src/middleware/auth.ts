import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
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

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401); // unauthorized

  const secret = process.env.JWT_SECRET;
  if (!secret)
    throw new Error('JWT_SECRET is not defined in environment variables');

  jwt.verify(token, secret, (err, decoded) => {
    if (err) return res.sendStatus(403); // forbidden
    // req.user = user;
    console.log(decoded);
    next();
  });
};

export const signToken = (user: string | object): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret)
    throw new Error('JWT_SECRET is not defined in environment variables');
  return jwt.sign(user, secret, {
    expiresIn: '365DAY',
    algorithm: 'HS256',
  });
};
