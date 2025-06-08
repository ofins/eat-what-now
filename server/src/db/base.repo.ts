import { IDatabase } from 'pg-promise';
import { IClient } from 'pg-promise/typescript/pg-subset';

export interface BaseRepositoryConfig {
  connectionString: string;
}
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
      console.log(
        `Database ${this.TABLE_NAME} connection successful:`,
        data.current_time
      );
    } catch (error) {
      console.error('Database initialization failed:', error);
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
        console.warn(`${this.TABLE_NAME} table does not exist`);
      }
    } catch (error) {
      console.error('Error verifying database structure:', error);
      throw error;
    }
  }
}
