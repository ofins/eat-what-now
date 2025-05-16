import { container } from 'tsyringe';
import { RestaurantService } from './db/restaurant';

container.register<RestaurantService>('RestaurantService', {
  useFactory: () => new RestaurantService(),
});
