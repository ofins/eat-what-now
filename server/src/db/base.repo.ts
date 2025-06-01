import pgPromise, { IDatabase, IMain } from 'pg-promise';
import { IClient } from 'pg-promise/typescript/pg-subset';

export interface BaseRepositoryConfig {
  connectionString: string;
}
export default abstract class BaseRepository<
  T extends BaseRepositoryConfig = BaseRepositoryConfig,
> {
  protected config: Required<T>;
  protected db: IDatabase<unknown, IClient>;
  protected TABLE_NAME: string;

  // constructor(db: IDatabase<unknown, IClient>, TABLE_NAME: string) {
  //   this.db = db;
  //   this.TABLE_NAME = TABLE_NAME;
  // }
  constructor(connectionString: string, TABLE_NAME: string) {
    const pgp: IMain = pgPromise();
    this.db = pgp(connectionString);
    this.config = { connectionString } as Required<T>;
    this.TABLE_NAME = TABLE_NAME;
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
        console.warn(
          `${this.TABLE_NAME} table does not exist, attempting to create it...`
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (this as any).createTable(); // Subclass should implement this
        console.log(`Successfully created ${this.TABLE_NAME} table`);
      }
    } catch (error) {
      console.error('Error verifying database structure:', error);
      throw error;
    }
  }

  protected abstract createTable(): Promise<void>;
}
