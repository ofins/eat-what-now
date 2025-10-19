import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  limit: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: 'draft-6',
  legacyHeaders: false,
});

const googleLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: {
    status: 429,
    error: 'Too many requests.',
  },
});

export default limiter;

export { googleLimiter };
