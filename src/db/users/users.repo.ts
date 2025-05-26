import pgPromise, { IMain } from 'pg-promise';
import BaseRepository from '../base.repo';
import seed from './seed.json';
import { IUser, UserFilterOptions } from './users.type';
import { PaginatedResponse, paginateResponse } from 'src/utils/pagination';

const tableName = 'users';
export class UserRepository extends BaseRepository {
  private readonly config: Required<unknown>;

  constructor(config = {}) {
    const mergedConfig = {
      ...config,
      connectionString: process.env.DATABASE_URL,
    };

    const pgp: IMain = pgPromise();
    const db = pgp(mergedConfig.connectionString as string);
    super(db, tableName);
    this.config = mergedConfig;

    this.initializeDatabase().then(() => this.verifyDatabaseStructure());
  }

  protected async createTable(): Promise<void> {
    try {
      await this.db.none(`
        CREATE TABLE IF NOT EXISTS ${tableName} (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email VARCHAR(255) NOT NULL UNIQUE,
          username VARCHAR(32) UNIQUE,
          password_hash TEXT,
          full_name VARCHAR(100),
          avatar_url TEXT,
          is_active BOOLEAN DEFAULT TRUE,
          is_verified BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        )
        `);

      const existingData = await this.db.oneOrNone(
        `SELECT COUNT(*) FROM ${tableName}`
      );

      if (existingData && parseInt(existingData.count) > 0) {
        console.log(
          'Users table already contains data, skipping seed data insertion'
        );
        return;
      }

      // seed
      await this.seedData();
    } catch (error) {
      console.error('Failed to create users table:', error);
      throw error;
    }
  }

  private async seedData(): Promise<void> {
    this.db.tx((t) => {
      const queries = seed.map((user) => {
        return t.none(
          `
          INSERT INTO ${tableName} (
            id, email, username, password_hash, full_name,
            avatar_url, is_active, is_verified, created_at, updated_at
          ) VALUES (
            $<id>, $<email>, $<username>, $<password_hash>, $<full_name>,
            $<avatar_url>, $<is_active>, $<is_verified>, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP 
          )
          `,
          user
        );
      });
      return t.batch(queries);
    });
  }

  async getUserById(id: number) {
    try {
      if (!Number.isInteger(id) || id <= 0) {
        throw new Error('Invalid user ID');
      }

      return await this.db.oneOrNone<IUser>(
        `SELECT * FROM ${tableName} WHERE id = $1`,
        [id]
      );
    } catch (error) {
      console.error(`Error fetching user by ID ${id}:`, error);
    }
  }

  async getUsers(
    options: UserFilterOptions
  ): Promise<PaginatedResponse<IUser>> {
    try {
      const { full_name, limit, offset } = options;

      let query = `
      SELECT * FROM users
      `;

      if (full_name) {
        query += `
        AND full_name = $${full_name}
        `;
      }

      const params: unknown[] = [];
      let paramIndex = 1;

      if (limit > 0) {
        query += `LIMIT $${paramIndex++}`;
        params.push(limit);
      }

      if (offset > 0) {
        query += `OFFSET $${paramIndex++}`;
        params.push(offset);
      }

      const data = await this.db.any<IUser>(query, params);
      const total = await this.db.one(
        'SELECT COUNT(*) FROM users',
        [],
        (row) => +row.count
      );

      return paginateResponse<IUser>(
        data,
        total,
        Number.isInteger(limit) ? limit : 10,
        Number.isInteger(offset) ? offset : 0
      );
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }
}
