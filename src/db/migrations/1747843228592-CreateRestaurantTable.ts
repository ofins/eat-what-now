import { MigrationInterface, QueryRunner } from 'typeorm';
import { Restaurant } from '../restaurant/entities/restaurant.entity';
import restaurantData from '../restaurant/seed';

export class CreateRestaurantTable1747843228592 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS restaurants (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address TEXT NOT NULL,
        cuisine_type VARCHAR(100) NOT NULL,
        price_range DECIMAL(3, 2) NOT NULL CHECK (price_range >= 0 AND price_range <= 5),
        rating DECIMAL(3, 2) NOT NULL CHECK (rating >= 0 AND rating <= 5),
        longitude DECIMAL(11, 8) NOT NULL,
        latitude DECIMAL(10, 8) NOT NULL,
        open_hours TEXT,
        contact_info TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const restaurantEntities = restaurantData.map((restaurant) => ({
      name: restaurant.name,
      address: restaurant.address,
      cuisine_type: restaurant.cuisine_type,
      price_range: restaurant.price_range,
      rating: restaurant.rating,
      longitude: restaurant.longitude,
      latitude: restaurant.latitude,
      open_hours: restaurant.open_hours,
      contact_info: restaurant.contact_info,
    }));

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(Restaurant)
      .values(restaurantEntities)
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from(Restaurant)
      .execute();
  }
}
