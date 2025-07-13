import dotenv from 'dotenv';

dotenv.config();

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export const development = {
  client: 'postgresql',
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: './src/db/migrations',
  },
  seeds: {
    directory: './src/db/migrations/seeds',
  },
};
export const staging = {
  client: 'postgresql',
  connection: {
    database: process.env.DB_DATABASE,
    user: 'postgres',
    password: 'password',
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'knex_migrations',
  },
};
export const production = {
  client: 'postgresql',
  connection: {
    database: 'my_db',
    user: 'username',
    password: 'password',
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'knex_migrations',
  },
};
