import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import feedRouter from './feed/feed.router';
import { swaggerUiHandler, swaggerUiSetup } from './swagger';

dotenv.config();

const app = express();

const port = process.env.PORT || 3000;

app.use('/docs', swaggerUiHandler, swaggerUiSetup);
app.use(cors());
app.use(express.json());

app.use('/feed', feedRouter);

app.get('/api/test', (req: Request, res: Response) => {
  res.json({ message: 'CORS is working!' });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
