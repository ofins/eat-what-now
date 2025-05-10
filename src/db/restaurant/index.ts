import dotenv from 'dotenv';
import pgPromise from 'pg-promise';

dotenv.config();

const pgp = pgPromise();

class Restaurant {
  private db;

  constructor() {
    this.db = pgp(process.env.DATABASE_URL || '');
    console.log('initializing restaurant DB...');
    this.db
      .one('SELECT NOW() AS current_time')
      .then((data) => {
        console.log('Connection successful:', data.current_time);
      })
      .catch((error) => {
        console.error('Connection failed:', error);
      });
  }

  async getRestaurants(longitude: string, latitude: string) {
    try {
      const data = await this.db.any(
        'SELECT * FROM restaurants WHERE longitude = $1 AND latitude = $2',
        [longitude, latitude]
      );
      return data;
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      throw error;
    }
  }
}

export default Restaurant;
