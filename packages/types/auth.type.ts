import type { Request } from "express";
import type { IUser } from "./users.type";

export interface LoginResponse {
  data: Partial<IUser>;
  token: string;
}

export type AuthRequest = Request & {
  userId: string;
};
