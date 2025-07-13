import pgPromise from 'pg-promise';
import { IClient } from 'pg-promise/typescript/pg-subset';
import ConfigService from 'src/config';
import { Logger } from 'src/log/logger';

interface DbServiceInterface {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  getConnection(): pgPromise.IDatabase<unknown, IClient>;
}

export class DbService implements DbServiceInterface {
  private connection: pgPromise.IDatabase<unknown, IClient> | null = null;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: Logger
  ) {}

  async connect() {
    const { db } = this.configService.getConfig();
    this.logger.info('Connecting to database:', db.database);

    try {
      const pgp = pgPromise();

      this.connection = pgp({
        host: db.host,
        port: db.port,
        database: db.database,
        user: db.user,
        password: db.password,
      });
      this.logger.info('Database connection established successfully');
    } catch (error) {
      this.logger.error('Database connection failed:', error as never);
      throw new Error(
        `Failed to connect to database: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  async disconnect() {
    if (this.connection) {
      await this.connection.$pool.end();
      this.connection = null;
      this.logger.info('Database connection closed');
    }
  }

  getConnection() {
    if (!this.connection) {
      throw new Error('Database connection is not established');
    }
    return this.connection;
  }
}
