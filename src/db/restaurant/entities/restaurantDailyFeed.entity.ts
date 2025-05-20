import { Entity, PrimaryColumn, Column, JoinColumn, ManyToOne } from 'typeorm';
import { Restaurant } from './restaurant.entity';

@Entity('restaurant_daily_feed')
export class RestaurantDailyFeed {
  @PrimaryColumn({ type: 'date' })
  date: Date;

  @PrimaryColumn()
  position: number;

  @Column()
  restaurant_id: number;

  @ManyToOne(() => Restaurant)
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Restaurant;
}
