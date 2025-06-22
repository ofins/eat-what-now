export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  if (!response.ok) throw new Error("Failed to Login");

  return response.json();
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
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        username,
        fullname,
      }),
    }
  );

  if (!response.ok) throw new Error("Failed to register");

  return response.json();
};
