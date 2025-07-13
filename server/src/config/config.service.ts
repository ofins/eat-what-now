import dotenv from 'dotenv';
import { ConfigServiceType } from './config.type';

dotenv.config();

class ConfigService {
  constructor() {
    validateEnv();
  }

  getConfig(): ConfigServiceType {
    return {
      db: {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5432,
        database: process.env.DB_DATABASE as string,
        user: process.env.DB_USER as string,
        password: process.env.DB_PASSWORD as string,
      },
    };
  }
}

export default ConfigService;

const REQUIRED_ENV_VARS = [
  'PORT',
  'SIGNATURE',
  'JWT_SECRET',
  'DB_DATABASE',
  'DB_USER',
  'DB_PASSWORD',
  'GOOGLE_API_KEY',
];

function validateEnv() {
  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
}
