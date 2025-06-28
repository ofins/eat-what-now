import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
    ALTER TABLE restaurants
      DROP COLUMN IF EXISTS cuisine_type,
      DROP COLUMN IF EXISTS open_hours,
      DROP COLUMN IF EXISTS contact_info,
      ADD COLUMN IF NOT EXISTS outbound_link VARCHAR(255) DEFAULT NULL;
`);
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(`
    ALTER TABLE restaurants
      ADD COLUMN IF NOT EXISTS cuisine_type VARCHAR(100) DEFAULT NULL,
      ADD COLUMN IF NOT EXISTS open_hours VARCHAR(100) DEFAULT NULL,
      ADD COLUMN IF NOT EXISTS contact_info VARCHAR(100) DEFAULT NULL,
      DROP COLUMN IF EXISTS outbound_link;
`);
}
