import { MigrationInterface, QueryRunner } from 'typeorm';

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

    await queryRunner.query(
      `INSERT INTO restaurants(name, address, cuisine_type, price_range, rating, longitude, latitude, open_hours, contact_info)
        VALUES 
        ('The Gourmet Spot', '123 Main St, Cityville', 'Italian', 4.5, 4.8, -73.935242, 40.73061, 'Mon-Sun: 10am-10pm', '123-456-7890'),
        ('Sushi Haven', '456 Elm St, Townsville', 'Japanese', 3.75, 4.5, -118.243683, 34.052235, 'Mon-Sun: 11am-11pm', '987-654-3210'),
        ('Taco Fiesta', '789 Oak St, Villagetown', 'Mexican', 2.5, 4.2, -95.369804, 29.760427, 'Mon-Sat: 9am-9pm', '555-123-4567'),
        ('Burger Bliss', '321 Pine St, Hamletville', 'American', 3.0, 4.0, -122.419418, 37.774929, 'Mon-Sun: 8am-8pm', '444-567-8901'),
        ('Curry Delight', '654 Maple St, Boroughcity', 'Indian', 4.0, 4.7, -80.191788, 25.761681, 'Mon-Sun: 12pm-10pm', '333-678-9012'),
        ('Dragon Wok', '987 Cedar St, Metropolis', 'Chinese', 3.5, 4.3, -74.0060, 40.7128, 'Mon-Sun: 10am-10pm', '222-345-6789')
        `
    );

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS restaurant_daily_feed (
        date DATE NOT NULL,
        position INT NOT NULL,
        restaurant_id INTEGER NOT NULL,
        PRIMARY KEY (date, position),
        FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
    )
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS restaurant_daily_feed;`);
    await queryRunner.query(`DROP TABLE IF EXISTS restaurants;`);
  }
}
