import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('restaurants', (table) => {
    table.string('img_url').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('restaurants', (table) => {
    table.dropColumn('img_url');
  });
}
