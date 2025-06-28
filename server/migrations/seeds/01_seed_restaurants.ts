import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex.raw('DELETE FROM restaurants');
  await knex.raw(`
    INSERT INTO restaurants (
      name, address, price_range, rating, longitude, latitude,
      total_upvotes, total_downvotes, total_favorites, total_comments, average_ratings, website,
      img_url, outbound_link, created_at, updated_at
    ) VALUES
      ('Sakura Sushi', '123 Cherry Blossom Lane, Tokyo', 3.5, 4.7, 139.6917, 35.6895, 120, 5, 80, 45, 4.6, 'https://sakurasushi.example.com', 'https://img.freepik.com/free-photo/beautiful-anime-food-cartoon-scene_23-2151035270.jpg', 'https://maps.google.com/?q=Sakura+Sushi+Tokyo', NOW(), NOW()),
      ('Bella Pasta', '456 Roma Avenue, Rome', 2.75, 4.3, 12.4964, 41.9028, 95, 8, 60, 30, 4.2, 'https://bellapasta.example.com', 'https://img.freepik.com/free-photo/beautiful-anime-food-cartoon-scene_23-2151035238.jpg', 'https://maps.google.com/?q=Bella+Pasta+Rome', NOW(), NOW()),
      ('Taco Fiesta', '789 Avenida Central, Mexico City', 1.5, 4.0, -99.1332, 19.4326, 110, 12, 70, 38, 3.9, 'https://tacofiesta.example.com', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPKtGRr2kGMjFbUgGMblDQlJPL-maQUh16FT5udsKwmFDDuu_l-2tiHwDOp3E5gsS5dOs&usqp=CAU', 'https://maps.google.com/?q=Taco+Fiesta+Mexico+City', NOW(), NOW()),
      ('Le Gourmet', '321 Rue de Paris, Paris', 4.25, 4.8, 2.3522, 48.8566, 150, 3, 100, 55, 4.7, 'https://legourmet.example.com', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkiVecC1-NE6-dvISzg14ftt3Kzal_E8Ji32lFYvL-gdtfgB8H7j-7LBk1NwvkOaMDBvg&usqp=CAU', 'https://maps.google.com/?q=Le+Gourmet+Paris', NOW(), NOW()),
      ('Spicy Dragon', '654 Dragon Road, Beijing', 2.0, 4.1, 116.4074, 39.9042, 85, 10, 50, 22, 4.0, 'https://spicydragon.example.com', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkiVecC1-NE6-dvISzg14ftt3Kzal_E8Ji32lFYvL-gdtfgB8H7j-7LBk1NwvkOaMDBvg&usqp=CAU', 'https://maps.google.com/?q=Spicy+Dragon+Beijing', NOW(), NOW());
`);
}
