import jwt from 'jsonwebtoken';

export class AuthService {
  signToken(user: string | object): string {
    const secret = process.env.JWT_SECRET;
    if (!secret)
      throw new Error('JWT_SECRET is not defined in environment variables');
    return jwt.sign(user, secret, {
      expiresIn: '365d', // 1 year
      algorithm: 'HS256',
    });
  }
}
