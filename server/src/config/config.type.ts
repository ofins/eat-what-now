export type ConfigServiceType = {
  db: DbConfigType;
  google: GoogleConfigType;
  server: ServerConfigType;
};

export type DbConfigType = {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
};

export type GoogleConfigType = {
  apiKey: string;
};

export type ServerConfigType = {
  port: number;
  signature: string;
  jwtSecret: string;
};
