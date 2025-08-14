import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
        ALTER TABLE restaurants
        ADD COLUMN IF NOT EXISTS comments JSONB;

        CREATE INDEX IF NOT EXISTS idx_user_id_lookup ON users (id);
        `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
        ALTER TABLE restaurants
        DROP COLUMN IF EXISTS comments;

        DROP INDEX IF EXISTS idx_user_id_lookup;
        `);
}
