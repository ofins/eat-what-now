import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('restaurants_test_1', (table) => {
    table.string('phone').nullable();
    table.string('website').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('restaurants_test_1', (table) => {
    table.dropColumn('phone');
    table.dropColumn('website');
  });
}
