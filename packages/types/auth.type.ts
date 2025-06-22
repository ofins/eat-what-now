import type { IUser } from "./users.type";

export interface LoginResponse {
  data: Partial<IUser>;
  token: string;
}
