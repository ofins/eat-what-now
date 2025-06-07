import {
  restaurantRepository,
  restaurantUserRepository,
  usersRepository,
} from '../server';

async function initializeAllTables() {
  // Ensure users table is created first
  await usersRepository.initializeDatabase();
  // await usersRepository.seedData();

  // Then restaurants table
  await restaurantRepository.initializeDatabase();
  // await restaurantRepository.seedData();

  // Then restaurant_user table
  await restaurantUserRepository.initializeDatabase();
  // await restaurantUserRepository.seedData();
}

initializeAllTables();
