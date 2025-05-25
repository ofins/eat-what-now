import { IDatabase } from 'pg-promise';
import { IClient } from 'pg-promise/typescript/pg-subset';

export default abstract class BaseRepository {
  protected db: IDatabase<unknown, IClient>;
  protected tableName: string;

  constructor(db: IDatabase<unknown, IClient>, tableName: string) {
    this.db = db;
    this.tableName = tableName;
  }

  protected async initializeDatabase(): Promise<void> {
    try {
      const data = await this.db.one('SELECT NOW() AS current_time');
      console.log('Database connection successful:', data.current_time);
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
        `SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = '${this.tableName}')`
      );

      if (!tableExists || !tableExists.exists) {
        console.warn(
          `${this.tableName} table does not exist, attempting to create it...`
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (this as any).createTable(); // Subclass should implement this
      }
    } catch (error) {
      console.error('Error verifying database structure:', error);
      throw error;
    }
  }

  protected abstract createTable(): Promise<void>;
}
