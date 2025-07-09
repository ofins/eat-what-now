import {
  createClient,
  RedisClientType,
} from '/Users/jack.w/Documents/tutorials/eat-what-now/node_modules/redis';
import dotenv from 'dotenv';
import logger from './log/logger';

dotenv.config();

const client: RedisClientType = createClient({
  url: process.env.REDIS_URL,
});

client.on('error', (err: string) => {
  console.error('Redis Client Error:', err);
});

(async () => {
  try {
    await client.connect();
    const val = await client.get('hello');
    console.log('Value from Redis:', val);
    console.log('Connected to Redis');
  } catch (err) {
    console.error('Failed to connect to Redis:', err);
  }
})();

// Cache utility function
export const getCachedData = async (key: string) => {
  try {
    const cachedData = await client.get(key);
    if (cachedData) {
      logger.info(`Cache hit for key: ${key}`);
      return JSON.parse(cachedData);
    }
    return null;
  } catch (error) {
    logger.error(`Redis get error for key ${key}:`, error);
    return null;
  }
};

export const setCachedData = async (
  key: string,
  data: unknown,
  ttl: number = 3600
) => {
  try {
    await client.set(key, JSON.stringify(data), {
      EX: ttl, // Time to live in seconds
    });
    logger.info(`Cache set for key: ${key} with TTL: ${ttl}s`);
  } catch (error) {
    logger.error(`Redis set error for key ${key}:`, error);
  }
};

export default client;
