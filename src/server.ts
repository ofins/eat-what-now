import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import 'reflect-metadata';
import { container } from 'tsyringe';
import { FeedController } from './feed/feed.controller';
import { authenticateAPIKey } from './middleware/auth';
import { swaggerUiHandler, swaggerUiSetup } from './swagger';
import { serveMarkdownFile } from './utils/file';

dotenv.config();

const app = express();

const port = process.env.PORT || 3000;

app.use('/docs', swaggerUiHandler, swaggerUiSetup);
app.use(cors());
app.use(express.json());

const feedController = container.resolve(FeedController);

app.use('/feed', authenticateAPIKey, feedController.getRestaurants);

app.get('/notes', async (_, res: Response) => {
  await serveMarkdownFile('src/notes.md', res);
});

app.get('/todo', async (_, res: Response) => {
  await serveMarkdownFile('src/todo.md', res);
});

app.get('/api/test', (req: Request, res: Response) => {
  res.json({ message: 'CORS is working!' });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
