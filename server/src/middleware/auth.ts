import { AuthRequest } from '@ewn/types/auth.type';
import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

dotenv.config();

const signature = process.env.SIGNATURE;

// * For internal API access using a static API key
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

// * For users accessing the API with JWT tokens
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.sendStatus(401);
    return; // unauthorized
  }

  const secret = process.env.JWT_SECRET;
  if (!secret)
    throw new Error('JWT_SECRET is not defined in environment variables');

  try {
    const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
    if (decoded && typeof decoded === 'object' && 'user_id' in decoded) {
      (req as AuthRequest).userId = decoded.user_id;
    }
    next();
  } catch {
    res.status(403).json({ error: 'Invalid token' }); // forbidden
    return;
  }
};

// * For API that may or may not have JWT
export const checkOptionalToken = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next();
  }

  const secret = process.env.JWT_SECRET;
  if (!secret)
    throw new Error('JWT_SECRET is not defined in environment variables');

  try {
    const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
    if (decoded && typeof decoded === 'object' && 'user_id' in decoded) {
      (req as AuthRequest).userId = decoded.user_id;
    }
    next();
  } catch {
    next();
  }
};

export const signToken = (user: string | object): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret)
    throw new Error('JWT_SECRET is not defined in environment variables');
  return jwt.sign(user, secret, {
    expiresIn: '365d', // 1 year
    algorithm: 'HS256',
  });
};
