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

// * - Singleton: One instance for the entire application lifecycle.
// should be consistent across entire application and shared
// example: config service, db service

// * - Transient: A new instance is created every time it is resolved.
// when dependencies do not share states between uses, ensuring each resolution is independent.
// example: logger service

// * - Scoped: An instance is created per request or scope (not used here).
// RequestContext in a class is injected in UserController
// UserController needs the value of the request context, so it is injected as a dependency.

// * Cradle
// - The container's `cradle` property provides access to all registered services.
// const {db, logger} = container.cradle;
// equivalent to
// const dbService = container.resolve(InjectionTokens.dbService);
// const loggerService = container.resolve(InjectionTokens.logger);
