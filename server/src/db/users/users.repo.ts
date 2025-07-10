import {
  CreateUserDBSchema,
  IUser,
  UserFilterOptions,
} from '@ewn/types/users.type';
import { IDatabase } from 'pg-promise';
import { IClient } from 'pg-promise/typescript/pg-subset';
import db from 'src/db/db';
import { isUUID } from 'src/utils/misc';
import { PaginatedResponse, paginateResponse } from 'src/utils/pagination';
import BaseRepository from '../base.repo';
import logger from 'src/log/logger';

const TABLE_NAME = 'users';

interface UsersRepositoryInterface {
  getUserById(id: string): Promise<IUser | null>;
  getUserByEmail(email: string): Promise<IUser | null>;
  getUserByUsername(username: string): Promise<IUser | null>;
  getUsers(options: UserFilterOptions): Promise<PaginatedResponse<IUser>>;
  createUser(data: CreateUserDBSchema): Promise<IUser>;
}
export class UsersRepository
  extends BaseRepository
  implements UsersRepositoryInterface
{
  protected db: IDatabase<unknown, IClient>;

  constructor() {
    super(db, TABLE_NAME);
    this.db = db;
  }

  async getUserById(id: string) {
    try {
      if (!isUUID(id)) {
        throw new Error('Invalid user ID');
      }

      return await this.db.oneOrNone<IUser>(
        `SELECT id, email, username, full_name, 
          avatar_url, is_active, is_verified, 
          created_at, updated_at FROM ${TABLE_NAME} WHERE id = $1`,
        [id]
      );
    } catch (error) {
      logger.error(`Error fetching user by ID ${id}:`, error);
      return null;
    }
  }

  async getUserByEmail(email: string) {
    try {
      return await this.db.oneOrNone<IUser>(
        `SELECT * FROM ${TABLE_NAME} WHERE email = $1`,
        [email]
      );
    } catch (error) {
      logger.error(`Error fetching user by email ${email}:`, error);
      return null;
    }
  }

  async getUserByUsername(username: string) {
    try {
      return await this.db.oneOrNone<IUser>(
        `SELECT * FROM ${TABLE_NAME} WHERE username = $1`,
        [username]
      );
    } catch (error) {
      logger.error(`Error fetching user by username ${username}:`, error);
      return null;
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
      logger.error('Error fetching users:', error);
      throw error;
    }
  }

  async createUser(data: CreateUserDBSchema) {
    try {
      const now = new Date();
      return await this.db.one<IUser>(
        `INSERT INTO ${TABLE_NAME} (
          email, username, password_hash, full_name, avatar_url,
          is_active, is_verified, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9
        ) RETURNING *`,
        [
          data.email,
          data.username,
          data.password_hash,
          data.full_name,
          '', // avatar_url default
          true, // is_active default
          false, // is_verified default
          now, // created_at
          now, // updated_at
        ]
      );
    } catch (error) {
      logger.error('Error creating user:', error);
      throw error;
    }
  }
}
