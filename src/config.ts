// Centralized configuration and environment variable validation
import dotenv from 'dotenv';
dotenv.config();

export const DEFAULT_RADIUS_KM = 5;
export const DEFAULT_LIMIT = 20;
export const MAX_SEARCH_RADIUS = 25;

export const REQUIRED_ENV_VARS = [
  'PORT',
  'SIGNATURE',
  'DB_HOST',
  'DB_USERNAME',
  'DB_PASSWORD',
  'DB_NAME',
];

export function validateEnv() {
  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
}
