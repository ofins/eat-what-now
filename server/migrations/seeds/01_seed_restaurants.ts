import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex.raw('DELETE FROM restaurants');
  await knex.raw(`
    INSERT INTO restaurants (
      name, address, cuisine_type, price_range, rating, longitude, latitude, open_hours, contact_info,
      total_upvotes, total_downvotes, total_favorites, total_comments, average_ratings, website,
      img_url, created_at, updated_at
    ) VALUES
      ('Sakura Sushi', '123 Cherry Blossom Lane, Tokyo', 'Japanese', 3.5, 4.7, 139.6917, 35.6895, '11:00-22:00', '+81 3-1234-5678', 120, 5, 80, 45, 4.6, 'www.example.com','https://img.freepik.com/free-photo/beautiful-anime-food-cartoon-scene_23-2151035270.jpg', NOW(), NOW()),
      ('Bella Pasta', '456 Roma Avenue, Rome', 'Italian', 2.75, 4.3, 12.4964, 41.9028, '12:00-23:00', '+39 06 1234 5678', 95, 8, 60, 30, 4.2, 'www.example.com', 'https://img.freepik.com/free-photo/beautiful-anime-food-cartoon-scene_23-2151035238.jpg', NOW(), NOW()),
      ('Taco Fiesta', '789 Avenida Central, Mexico City', 'Mexican', 1.5, 4.0, -99.1332, 19.4326, '10:00-21:00', '+52 55 1234 5678', 110, 12, 70, 38, 3.9, 'www.example.com', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPKtGRr2kGMjFbUgGMblDQlJPL-maQUh16FT5udsKwmFDDuu_l-2tiHwDOp3E5gsS5dOs&usqp=CAU', NOW(), NOW()),
      ('Le Gourmet', '321 Rue de Paris, Paris', 'French', 4.25, 4.8, 2.3522, 48.8566, '17:00-23:30', '+33 1 23 45 67 89', 150, 3, 100, 55, 4.7, 'www.example.com', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkiVecC1-NE6-dvISzg14ftt3Kzal_E8Ji32lFYvL-gdtfgB8H7j-7LBk1NwvkOaMDBvg&usqp=CAU', NOW(), NOW()),
      ('Spicy Dragon', '654 Dragon Road, Beijing', 'Chinese', 2.0, 4.1, 116.4074, 39.9042, '09:00-20:00', '+86 10 1234 5678', 85, 10, 50, 22, 4.0, 'www.example.com', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkiVecC1-NE6-dvISzg14ftt3Kzal_E8Ji32lFYvL-gdtfgB8H7j-7LBk1NwvkOaMDBvg&usqp=CAU', NOW(), NOW())
    ;
  `);
}
