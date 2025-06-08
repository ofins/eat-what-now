import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE TABLE restaurant_user (
      id SERIAL PRIMARY KEY,
      user_id UUID NOT NULL,
      restaurant_id INTEGER NOT NULL,
      upvoted BOOLEAN DEFAULT FALSE,
      downvoted BOOLEAN DEFAULT FALSE,
      favorited BOOLEAN DEFAULT FALSE,
      rating INTEGER CHECK (rating IS NULL OR (rating >= 1 AND rating <= 5)),
      comment TEXT,
      visited_at TIMESTAMP,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      CONSTRAINT unique_user_restaurant UNIQUE (user_id, restaurant_id),
      CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      CONSTRAINT fk_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
      CONSTRAINT check_upvote_downvote CHECK (NOT (upvoted AND downvoted))
    );
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`DROP TABLE IF EXISTS restaurant_user;`);
}
