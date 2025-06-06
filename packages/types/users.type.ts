import type { PaginationTypes } from "./index";

export interface IUser {
  id: string;
  email: string;
  username: string;
  password_hash: string;
  full_name?: string;
  avatar_url?: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: Date;
  updated_at?: Date;
}

export interface UserFilterOptions extends PaginationTypes {
  email?: string;
  username?: string;
  full_name?: string;
  is_active?: boolean;
  is_verified?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateUser {
  email: string;
  username: string;
  password: string;
  full_name?: string;
}

export interface CreateUserDBSchema {
  email: string;
  username: string;
  password_hash: string;
  full_name?: string;
}
