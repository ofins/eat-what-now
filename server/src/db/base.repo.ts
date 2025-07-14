import { IDatabase } from 'pg-promise';
import { IClient } from 'pg-promise/typescript/pg-subset';
import logger from 'src/log/logger';

export interface BaseRepositoryConfig {
  connectionString: string;
}

// * Difference between abstract and interface
// * Abstract class can have implementation, interfaces cannot
// * Abstract class can have state (properties), interfaces cannot
// * Abstract class can have constructors, interfaces cannot
// * Abstract class can extend other classes, interfaces can extend multiple interfaces
// * Abstract class can have access modifiers (public, private, protected), interfaces cannot
// * Abstract class can have static methods, interfaces cannot
// * Abstract class can be instantiated, interfaces cannot
// * Abstract class can have default implementations, interfaces cannot

// abstracts are generally used on real-world entities that have some shared behavior or state
// interfaces are used to define contracts that can be implemented by any class
export default abstract class BaseRepository {
  protected db: IDatabase<unknown, IClient>;
  protected TABLE_NAME: string;

  constructor(db: IDatabase<unknown, IClient>, TABLE_NAME: string) {
    this.db = db;
    this.TABLE_NAME = TABLE_NAME;
    this.initializeDatabase()
      .then(() => this.verifyDatabaseStructure())
      .catch((error) => {
        console.error('Error during database initialization:', error);
      });
  }

  public async initializeDatabase(): Promise<void> {
    try {
      const data = await this.db.one('SELECT NOW() AS current_time');
      logger.info(
        `Database ${this.TABLE_NAME} connection successful:`,
        data.current_time
      );
    } catch (error) {
      logger.error('Database initialization failed:', error);
      throw new Error(
        `Failed to initialize database: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  protected async verifyDatabaseStructure(): Promise<void> {
    try {
      const tableExists = await this.db.oneOrNone(
        `SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = '${this.TABLE_NAME}')`
      );

      if (!tableExists || !tableExists.exists) {
        logger.warn(`${this.TABLE_NAME} table does not exist`);
      }
    } catch (error) {
      logger.error('Error verifying database structure:', error);
      throw error;
    }
  }
}
