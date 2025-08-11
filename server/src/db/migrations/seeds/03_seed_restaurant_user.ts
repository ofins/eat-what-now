import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex.raw('DELETE FROM restaurant_user');
  await knex.raw(`
  INSERT INTO restaurant_user (
    restaurant_id, user_id, upvoted, favorited, rating, comment, visited_at, created_at, updated_at
  ) VALUES
    (1, '3e2a8a7b-4f11-4c3f-b38f-0e925f3e1d9b', true, true, 5, 'Amazing food and great service!', '2025-06-01T12:00:00Z', '2025-06-01T12:00:00Z', '2025-06-01T12:00:00Z'),
    (2, 'a95c9b22-2d9b-4b87-a93a-7c1de3f88e62', false, false, 2, 'Not impressed with the quality.', '2025-06-02T14:30:00Z', '2025-06-02T14:30:00Z', '2025-06-02T14:30:00Z')
`);
}
