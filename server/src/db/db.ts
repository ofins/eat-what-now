import pgPromise from 'pg-promise';

// ? why does env work without dotenv?

const pgp = pgPromise();
const db = pgp({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

export default db;
