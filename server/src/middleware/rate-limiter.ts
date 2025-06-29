import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  limit: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: 'draft-6',
  legacyHeaders: false,
});

export default limiter;
