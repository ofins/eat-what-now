import dotenv from 'dotenv';
import 'reflect-metadata';
dotenv.config();

import cors from 'cors';
import express, { Response } from 'express';
import helmet from 'helmet';
import { container } from './di/di.container';
import { InjectionTokens } from './di/enum/injections-token.enum';
import logger from './log/logger';
import morganMiddleware from './middleware/morgan';
import limiter from './middleware/rate-limiter';
import { swaggerUiHandler, swaggerUiSetup } from './swagger';
import { serveMarkdownFile } from './utils/file';

export async function startServer() {
  try {
    const { initContainer } = await import('./di/di.container');
    initContainer();

    const dbService = container.resolve(InjectionTokens.dbService);
    await dbService.connect();

    const authRouter = (await import('./routes/auth.router')).default;
    const feedRouter = (await import('./routes/feed.router')).default;
    const restaurantsRouter = (await import('./routes/restaurants.router'))
      .default;
    const usersRouter = (await import('./routes/users.router')).default;
    const restaurantUserRouter = (
      await import('./routes/restaurant-user.router')
    ).default;

    const app = express();
    const port = process.env.PORT || 3000;

    app.use('/docs', swaggerUiHandler, swaggerUiSetup);
    app.use(cors());
    app.use(helmet());
    app.use(express.json());
    app.use(morganMiddleware);
    app.use(limiter);

    app.get('/health', (_req, res) => {
      res.status(200).json({ status: 'ok' });
    });

    app.use('/feed', feedRouter);
    app.use('/users', usersRouter);
    app.use('/restaurants', restaurantsRouter);
    app.use('/restaurant-user', restaurantUserRouter);
    app.use('/auth', authRouter);

    app.get('/notes', async (_, res: Response) => {
      await serveMarkdownFile('src/notes.md', res);
    });

    app.get('/todo', async (_, res: Response) => {
      await serveMarkdownFile('src/todo.md', res);
    });

    app.listen(port, () => {
      logger.info(`App listening on port ${port}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}
