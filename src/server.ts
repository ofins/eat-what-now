import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import 'reflect-metadata';
import { container } from 'tsyringe';
import { FeedController } from './feed/feed.controller';
import { swaggerUiHandler, swaggerUiSetup } from './swagger';

dotenv.config();

const app = express();

const port = process.env.PORT || 3000;

app.use('/docs', swaggerUiHandler, swaggerUiSetup);
app.use(cors());
app.use(express.json());

const feedController = container.resolve(FeedController);

app.use('/feed', feedController.getRestaurants);

app.get('/api/test', (req: Request, res: Response) => {
  res.json({ message: 'CORS is working!' });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
