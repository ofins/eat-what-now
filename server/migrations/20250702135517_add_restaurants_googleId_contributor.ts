import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE restaurants
    ADD COLUMN google_id VARCHAR(255) UNIQUE,
    ADD COLUMN contributor_username VARCHAR(255) DEFAULT NULL;
`);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE restaurants
    DROP COLUMN google_id,
    DROP COLUMN contributor_username;
`);
}
