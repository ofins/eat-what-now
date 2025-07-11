import * as awilix from 'awilix';
import db from 'src/db/db';
import { RestaurantUserRepository } from 'src/db/restaurant-user/restaurant-user.repo';
import { RestaurantsController } from 'src/db/restaurants/restaurants.controller';
import { RestaurantsRepository } from 'src/db/restaurants/restaurants.repo';
import { UsersController } from 'src/db/users/users.controller';
import { UsersRepository } from 'src/db/users/users.repo';
import logger from 'src/log/logger';
import { InjectionTokens } from './injections-token.enum';
import { MAX_SEARCH_RADIUS, DEFAULT_LIMIT } from 'src/config';

export const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.CLASSIC, // Use CLASSIC mode for constructor injection,
  strict: true, // Enforce strict mode to catch errors early
});

export function initContainer() {
  container.register({
    [InjectionTokens.config]: awilix.asValue({
      maxSearchRadius: MAX_SEARCH_RADIUS,
      defaultLimit: DEFAULT_LIMIT,
    }),
    [InjectionTokens.db]: awilix.asValue(db),
    [InjectionTokens.restaurantsRepository]: awilix.asClass(
      RestaurantsRepository
    ),
    [InjectionTokens.restaurantUserRepository]: awilix.asClass(
      RestaurantUserRepository
    ),
    [InjectionTokens.restaurantsController]: awilix.asClass(
      RestaurantsController
    ),
    [InjectionTokens.usersRepository]: awilix.asClass(UsersRepository),
    [InjectionTokens.usersController]: awilix.asClass(UsersController),
    [InjectionTokens.logger]: awilix.asValue(logger),
  });
}
