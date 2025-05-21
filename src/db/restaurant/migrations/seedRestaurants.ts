import { MigrationInterface, QueryRunner } from 'typeorm';
import restaurantData from '../seed';
import { Restaurant } from '../entities/restaurant.entity';

export class SeedRestaurants implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
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
