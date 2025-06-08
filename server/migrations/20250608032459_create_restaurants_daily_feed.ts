import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
    CREATE TABLE IF NOT EXISTS restaurants_daily_feed (
      date DATE NOT NULL,
      position INT NOT NULL,
      restaurant_id INTEGER NOT NULL,
      PRIMARY KEY (date, position),
      FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
    );`);
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(`
        DROP TABLE IF EXISTS restaurants_daily_feed;
    `);
}
