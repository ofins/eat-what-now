import {
  restaurantRepository,
  restaurantUserRepository,
  usersRepository,
} from '../server';

async function initializeAllTables() {
  await restaurantRepository.initializeDatabase();
  await restaurantRepository.seedData();

  await usersRepository.initializeDatabase();
  await usersRepository.seedData();

  await restaurantUserRepository.initializeDatabase();
  await restaurantUserRepository.seedData();
}

initializeAllTables();
