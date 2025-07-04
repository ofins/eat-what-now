import 'reflect-metadata';

import cors from 'cors';
import express, { Response } from 'express';
import { validateEnv } from './config';
import { RestaurantUserRepository } from './db/restaurant-user/restaurant-user.repo';
import { RestaurantsRepository } from './db/restaurants/restaurants.repo';
import { UsersRepository } from './db/users/users.repo';
import authRouter from './routes/auth.router';
import eventsRouter from './routes/events.router';
import feedRouter from './routes/feed.router';
import restaurantsRouter from './routes/restaurants.router';
import usersRouter from './routes/users.router';
import { swaggerUiHandler, swaggerUiSetup } from './swagger';
import { serveMarkdownFile } from './utils/file';
import logger from './log/logger';
import morganMiddleware from './middleware/morgan';
import limiter from './middleware/rate-limiter';
import helmet from 'helmet';

// Validate environment variables at startup
validateEnv();

const app = express();

const port = process.env.PORT || 3000;

export const restaurantRepository = new RestaurantsRepository();
export const usersRepository = new UsersRepository();
export const restaurantUserRepository = new RestaurantUserRepository();

app.use('/docs', swaggerUiHandler, swaggerUiSetup);
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morganMiddleware);
app.use(limiter);

app.use('/feed', feedRouter);
app.use('/users', usersRouter);
app.use('/restaurants', restaurantsRouter);
app.use('/auth', authRouter);
app.use('/events', eventsRouter);

app.get('/notes', async (_, res: Response) => {
  await serveMarkdownFile('src/notes.md', res);
});

app.get('/todo', async (_, res: Response) => {
  await serveMarkdownFile('src/todo.md', res);
});

app.listen(port, () => {
  logger.info(`App listening on port ${port}`);
});
