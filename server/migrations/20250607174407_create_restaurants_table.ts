import { Knex } from 'knex';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('restaurants_test_1', function (table) {
    table.increments('id').primary();
    table.string('name', 255).notNullable();
    table.text('address').notNullable();
    table.string('cuisine_type', 100).notNullable();
    table.decimal('price_range', 3, 2).notNullable().checkBetween([0, 5]);
    table.decimal('rating', 3, 2).notNullable().checkBetween([0, 5]);
    table.decimal('longitude', 11, 8).notNullable();
    table.decimal('latitude', 10, 8).notNullable();
    table.text('open_hours');
    table.text('contact_info');
    table.integer('total_upvotes').defaultTo(0);
    table.integer('total_downvotes').defaultTo(0);
    table.integer('total_favorites').defaultTo(0);
    table.integer('total_comments').defaultTo(0);
    table.decimal('average_ratings', 3, 2).notNullable().checkBetween([0, 5]);
    table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).defaultTo(knex.fn.now());
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('restaurants');
}
