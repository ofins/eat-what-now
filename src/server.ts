import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import feedRouter from './feed/feed.router';

dotenv.config();

// const pgp = pgPromise();
// const db = pgp(process.env.DATABASE_URL || '');

// db.one('SELECT NOW() AS current_time')
//   .then((data) => {
//     console.log('Connection successful:', data.current_time);
//   })
//   .catch((error) => {
//     console.error('Connection failed:', error);
//   });

const app = express();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/feed', feedRouter);

app.get('/api/test', (req: Request, res: Response) => {
  res.json({ message: 'CORS is working!' });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
