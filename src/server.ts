import 'reflect-metadata';

import cors from 'cors';
import express, { Request, Response } from 'express';
import { validateEnv } from './config';
import feedRouter from './routes/feed.router';
import usersRouter from './routes/users.router';
import { swaggerUiHandler, swaggerUiSetup } from './swagger';
import { serveMarkdownFile } from './utils/file';

// Validate environment variables at startup
validateEnv();

const app = express();

const port = process.env.PORT || 3000;

app.use('/docs', swaggerUiHandler, swaggerUiSetup);
app.use(cors());
app.use(express.json());

app.use('/feed', feedRouter);
app.use('/users', usersRouter);

app.get('/notes', async (_, res: Response) => {
  await serveMarkdownFile('src/notes.md', res);
});

app.get('/todo', async (_, res: Response) => {
  await serveMarkdownFile('src/todo.md', res);
});

app.get('/api/test', (_: Request, res: Response) => {
  res.json({ message: 'CORS is working!' });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
