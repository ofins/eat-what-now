import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) NOT NULL UNIQUE,
      username VARCHAR(32) UNIQUE,
      password_hash TEXT,
      full_name VARCHAR(100),
      avatar_url TEXT,
      is_active BOOLEAN DEFAULT TRUE,
      is_verified BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    )
`);
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(`DROP TABLE IF EXISTS users;`);
}
