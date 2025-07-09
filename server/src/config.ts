// Centralized configuration and environment variable validation

import knex from 'knex';
import { development } from '../knexfile';

import dotenv from 'dotenv';
dotenv.config();

export const DEFAULT_RADIUS_KM = 5;
export const DEFAULT_LIMIT = 20;
export const MAX_SEARCH_RADIUS = 501;

export const REQUIRED_ENV_VARS = [
  'PORT',
  'SIGNATURE',
  'JWT_SECRET',
  // 'DATABASE_URL',
  'DB_DATABASE',
  'DB_USER',
  'DB_PASSWORD',
  'GOOGLE_API_KEY',
];

export function validateEnv() {
  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const db = knex(development as any);
