import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex.raw('DELETE FROM users');
  await knex.raw(`
    INSERT INTO users (
      id, email, username, password_hash, full_name, avatar_url, is_active, is_verified, created_at, updated_at
    ) VALUES
      ('3e2a8a7b-4f11-4c3f-b38f-0e925f3e1d9b', 'alice@example.com', 'alice_w', 'hashed_password_1', 'Alice Walker', 'https://example.com/avatars/alice.jpg', true, true, '2025-05-25T10:00:00Z', '2025-05-25T10:00:00Z'),
      ('a95c9b22-2d9b-4b87-a93a-7c1de3f88e62', 'bob@example.com', 'bob_the_builder', 'hashed_password_2', 'Bob Builder', 'https://example.com/avatars/bob.png', true, false, '2025-05-20T15:30:00Z', '2025-05-22T08:45:00Z'),
      ('c47f5c1a-85c9-4b8a-a3b7-24d7f8b129a4', 'carol@example.com', 'carol_singer', 'hashed_password_3', 'Carol Johnson', NULL, false, true, '2025-04-15T12:00:00Z', '2025-05-10T09:30:00Z'),
      ('e764cf4f-2d2b-4ff8-8f53-91911e0b5e5b', 'david@example.com', 'davey', 'hashed_password_4', 'David Smith', 'https://example.com/avatars/david.jpg', true, true, '2025-03-10T08:20:00Z', '2025-05-24T14:10:00Z'),
      ('d9821f9e-9f37-4f1a-9c70-6777c8a72b2e', 'emma@example.com', 'emma_l', 'hashed_password_5', 'Emma Lee', NULL, false, false, '2025-01-05T11:45:00Z', '2025-02-01T10:00:00Z')
  `);
}
