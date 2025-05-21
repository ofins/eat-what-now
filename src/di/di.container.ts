import { container } from 'tsyringe';
import { RestaurantService } from '../db/restaurant/restaurant.service';
import { InjectionTokensEnum } from './enums/injection-tokens.enum';
import { RestaurantDataSource } from 'src/db/restaurant/data-source';
import { DataSource } from 'typeorm';

// Register DataSource as singleton
container.registerInstance('DataSource', RestaurantDataSource);

// Register the RestaurantService with DataSource dependency
container.register<RestaurantService>(InjectionTokensEnum.RESTAURANT_SERVICE, {
  useFactory: (dependencyContainer) => {
    const dataSource: DataSource = dependencyContainer.resolve('DataSource');
    return new RestaurantService(dataSource);
  },
});
