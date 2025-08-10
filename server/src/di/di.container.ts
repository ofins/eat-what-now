import * as awilix from 'awilix';
import ConfigService from 'src/config/config.service';
import { GoogleController } from 'src/controllers/google.controller';
import { RestaurantUserController } from 'src/controllers/restaurant-user.controller';
import { RestaurantsController } from 'src/controllers/restaurants.controller';
import { UsersController } from 'src/controllers/users.controller';
import { DbService } from 'src/db/db';
import logger from 'src/log/logger';
import { RestaurantUserRepository } from 'src/repositories/restaurant-user.repo';
import { RestaurantsRepository } from 'src/repositories/restaurants.repo';
import { UsersRepository } from 'src/repositories/users.repo';
import { RestaurantUserService } from 'src/services/restaurant-user.service';
import { RestaurantsService } from 'src/services/restaurants.service';
import { UsersService } from 'src/services/users.service';
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
    [InjectionTokens.restaurantUserController]: awilix
      .asClass(RestaurantUserController)
      .singleton(),
    [InjectionTokens.restaurantUserService]: awilix
      .asClass(RestaurantUserService)
      .singleton(),
    [InjectionTokens.restaurantsService]: awilix
      .asClass(RestaurantsService)
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
    [InjectionTokens.googleController]: awilix
      .asClass(GoogleController)
      .singleton(),
    [InjectionTokens.usersService]: awilix.asClass(UsersService).singleton(),

    [InjectionTokens.logger]: awilix.asValue(logger),
  });
}
