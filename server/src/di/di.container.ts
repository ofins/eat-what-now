import * as awilix from 'awilix';
import ConfigService from 'src/config/config.service';
import { DbService } from 'src/db/db';
import { RestaurantUserRepository } from 'src/db/restaurant-user/restaurant-user.repo';
import { RestaurantsController } from 'src/db/restaurants/restaurants.controller';
import { RestaurantsRepository } from 'src/db/restaurants/restaurants.repo';
import { UsersController } from 'src/db/users/users.controller';
import { UsersRepository } from 'src/db/users/users.repo';
import logger from 'src/log/logger';
import { InjectionTokens } from './enum/injections-token.enum';

export const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.CLASSIC, // Use CLASSIC mode for constructor injection,
  strict: true, // Enforce strict mode to catch errors early
});

export function initContainer() {
  container.register({
    [InjectionTokens.configService]: awilix.asClass(ConfigService).singleton(),
    [InjectionTokens.dbService]: awilix.asClass(DbService).singleton(),
    [InjectionTokens.restaurantsRepository]: awilix
      .asClass(RestaurantsRepository)
      .singleton(),
    [InjectionTokens.restaurantUserRepository]: awilix
      .asClass(RestaurantUserRepository)
      .singleton(),
    [InjectionTokens.restaurantsController]: awilix
      .asClass(RestaurantsController)
      .singleton(),
    [InjectionTokens.usersRepository]: awilix
      .asClass(UsersRepository)
      .singleton(),
    [InjectionTokens.usersController]: awilix
      .asClass(UsersController)
      .singleton(),
    [InjectionTokens.logger]: awilix.asValue(logger),
  });
}
