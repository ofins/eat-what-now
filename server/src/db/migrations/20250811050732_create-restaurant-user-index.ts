import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
        ALTER TABLE restaurants
        DROP COLUMN total_downvotes,
        DROP COLUMN average_ratings;

        ALTER TABLE restaurant_user
        DROP COLUMN downvoted,
        DROP CONSTRAINT IF EXISTS check_upvote_downvote;

        CREATE INDEX IF NOT EXISTS idx_restaurant_user_lookup ON restaurant_user(restaurant_id, user_id);
    `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
        ALTER TABLE restaurants
        ADD COLUMN total_downvotes INTEGER DEFAULT 0,
        ADD COLUMN average_ratings FLOAT DEFAULT 0;

        ALTER TABLE restaurant_user
        ADD COLUMN downvoted BOOLEAN DEFAULT FALSE,
        ADD CONSTRAINT IF NOT EXISTS check_upvote_downvote CHECK (NOT (upvoted AND downvoted));

        DROP INDEX IF EXISTS idx_restaurant_user_lookup ON restaurant_user;
    `);
}
