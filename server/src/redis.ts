import {
  createClient,
  RedisClientType,
} from '/Users/jack.w/Documents/tutorials/eat-what-now/node_modules/redis';
import dotenv from 'dotenv';

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

export default client;
