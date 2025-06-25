import type { LoginResponse } from "@ewn/types/auth.type";
import { httpClient } from "./http-client";
export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const response = await httpClient.post<LoginResponse>(
    `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
    {
      email,
      password,
    }
  );

  if (!response) throw new Error("Failed to Login");

  return response;
};

export const register = async ({
  email,
  username,
  password,
  fullname,
}: {
  email: string;
  username: string;
  password: string;
  fullname: string;
}) => {
  const response = await httpClient.post(
    `${import.meta.env.VITE_API_BASE_URL}/auth/register`,
    {
      email,
      password,
      username,
      fullname,
    }
  );

  if (!response) throw new Error("Failed to register");

  return response;
};
