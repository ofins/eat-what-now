import {
  CreateUser,
  CreateUserDto,
  IUser,
  UpdateUserDto,
} from '@ewn/types/users.type';
import logger from 'src/log/logger';
import { DbService } from '../db/db';

const TABLE_NAME = 'users';

export class UsersRepository {
  constructor(private readonly dbService: DbService) {}

  create(createUserDto: CreateUserDto): CreateUser {
    return {
      ...createUserDto,
      avatar_url: '', // default avatar
      is_active: true, // default active
      is_verified: false, // default not verified
      created_at: new Date(),
      updated_at: new Date(),
    };
  }

  async save(user: CreateUser): Promise<IUser> {
    try {
      return await this.dbService.getConnection().one<IUser>(
        `INSERT INTO ${TABLE_NAME} (
          email, username, password_hash, full_name, avatar_url,
          is_active, is_verified, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9
        ) RETURNING *`,
        [
          user.email,
          user.username,
          user.password_hash,
          user.full_name,
          user.avatar_url,
          user.is_active,
          user.is_verified,
          user.created_at,
          user.updated_at,
        ]
      );
    } catch (error) {
      logger.error(`Error saving user ${user.username}:`, error);
      throw error;
    }
  }

  async find({
    limit,
    offset,
  }: {
    limit: number;
    offset: number;
  }): Promise<IUser[]> {
    try {
      return await this.dbService
        .getConnection()
        .any<IUser>(`SELECT * FROM ${TABLE_NAME} LIMIT $1 OFFSET $2`, [
          limit,
          offset,
        ]);
    } catch (error) {
      logger.error('Error fetching users:', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<IUser | null> {
    try {
      return await this.dbService
        .getConnection()
        .oneOrNone<IUser>(`SELECT * FROM ${TABLE_NAME} WHERE id = $1`, [id]);
    } catch (error) {
      logger.error(`Error fetching user with id ${id}:`, error);
      return null;
    }
  }

  async findOneByQuery(query: string, param: string): Promise<IUser | null> {
    try {
      return await this.dbService
        .getConnection()
        .oneOrNone<IUser>(`SELECT * FROM ${TABLE_NAME} WHERE ${query} = $1`, [
          param,
        ]);
    } catch (error) {
      logger.error(`Error fetching user with query ${query}:`, error);
      return null;
    }
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto
  ): Promise<IUser | null> {
    try {
      return await this.dbService.getConnection().oneOrNone<IUser>(
        `UPDATE ${TABLE_NAME} SET
            email = $1,
            username = $2,
            full_name = $3,
            avatar_url = $4,
            is_active = $5,
            is_verified = $6,
            updated_at = $7
          WHERE id = $8 RETURNING *`,
        [
          updateUserDto.email,
          updateUserDto.username,
          updateUserDto.full_name,
          updateUserDto.avatar_url,
          updateUserDto.is_active,
          updateUserDto.is_verified,
          new Date(),
          id,
        ]
      );
    } catch (error) {
      logger.error(`Error updating user with id ${id}:`, error);
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.dbService
        .getConnection()
        .result(`DELETE FROM ${TABLE_NAME} WHERE id = $1`, [id]);

      return result.rowCount > 0;
    } catch (error) {
      logger.error(`Error deleting user with id ${id}:`, error);
      throw error;
    }
  }
}
