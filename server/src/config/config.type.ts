export type ConfigServiceType = {
  db: DbConfigType;
};

export type DbConfigType = {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
};
