import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Check,
} from 'typeorm';

@Entity('restaurants')
export class Restaurant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: false })
  address: string;

  @Column({ length: 100, nullable: false })
  @Index('idx_restaurants_cuisine')
  cuisine_type: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: false })
  @Check('price_range >= 0 AND price_range <= 5')
  price_range: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: false })
  @Check('rating >= 0 AND rating <= 5')
  @Index('idx_restaurants_rating')
  rating: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: false })
  longitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: false })
  latitude: number;

  @Index('idx_restaurants_location')
  @Column({ type: 'text', nullable: true })
  open_hours: string | null;

  @Column({ type: 'text', nullable: true })
  contact_info: string | null;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;
}
