import { container } from 'tsyringe';
import { RestaurantService } from '../db/restaurant';
import { InjectionTokensEnum } from './enums/injection-tokens.enum';

container.register<RestaurantService>(InjectionTokensEnum.RESTAURANT_SERVICE, {
  useFactory: () => new RestaurantService(),
});
