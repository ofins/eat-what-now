// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export const development = {
  client: 'postgresql',
  connection: {
    database: 'my_database',
    user: 'jack.w',
    password: 'password',
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: './migrations',
  },
  seeds: {
    directory: './migrations/seeds',
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
