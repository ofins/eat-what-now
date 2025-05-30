# EatWhatNow Backend

Backend API for EatWhatNow — a restaurant discovery and user engagement platform.

_EatWhatNow is the first backend project I am building to become more familiar with server and system design as a frontend engineer._

## Overview

Struggling to find a place to eat tonight? Try EatWhatNow, the app that makes dining decisions easy! Visit the site, and it instantly suggests top-rated restaurants near you.

## Project Preferences

- `then/catch` instead of `async/await` because I write all my projects in the latter.
- raw SQL without ORM to focus on getting familiar with fundamentals.

## Features

- **User Authentication**: JWT-based login and registration
- **Restaurant CRUD**: Create, read, update, delete restaurants
- **User CRUD**: Manage users
- **Feed API**: Location-based, filterable restaurant feed
- **Restaurant-User Join Table**: Track upvotes, downvotes, favorites, ratings, comments, and visits
- **Swagger API Docs**: `/docs` endpoint
- **PostgreSQL**: Data storage with seed data and migrations
- **CRON Jobs**: Aggregates restaurant stats hourly

## Tech Stack

- Node.js, Express, TypeScript
- PostgreSQL (with pg-promise)
- JWT for authentication
- Swagger for API documentation
- bcrypt for password hashing

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)

### Environment Variables

Copy `.env.example` to `.env` and fill in the required values:

```
PORT=3000
SIGNATURE=your_api_key
JWT_SECRET=your_jwt_secret
DATABASE_URL=postgres://postgres:password@localhost:5432/database
```

### Local Development

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Run the backend:**
   ```sh
   npm run server
   ```
3. **Access API docs:**
   - [http://localhost:3000/docs](http://localhost:3000/docs)

## API Overview

### Authentication

- `POST /auth/login` — Login with email and password, returns JWT
- `POST /auth/register` — Register a new user

### Users

- `GET /users` — List users (pagination supported)

### Restaurants

- `GET /restaurants` — List restaurants
- `POST /restaurants` — Create a restaurant
- `PUT /restaurants/:id` — Update a restaurant
- `DELETE /restaurants/:id` — Delete a restaurant

### Feed

- `GET /feed` — Get a randomized, filterable feed of restaurants (supports location, cuisine, price, rating, etc.)

### Restaurant-User Actions

- `POST /restaurants/user` — Upvote, downvote, favorite, rate, comment, or mark as visited

## Authentication

- **API Key**: Pass `x-signature` header with your API key for protected endpoints
- **JWT**: Pass `Authorization: Bearer <token>` for user-protected endpoints

## Database

- Tables: `users`, `restaurants`, `restaurant_user`, `restaurant_daily_feed`
- Seed data is loaded on first run
- Aggregated stats (upvotes, downvotes, etc.) are updated hourly via CRON

## API Data Formats

**Single-data**

```typescript
interface SingleData<T> {
  data?: T;
  message?: string;
  error?: string;
}
```

**List data**

```typescript
interface ListData<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
  page: number;
  totalPages: number;
  error?: string;
}
```

## Development

- **Lint:** `npm run lint`
- **Format:** `npm run format`
- **Build:** `npm run build`

## Notes

- See [`src/notes.md`](src/notes.md) and [`src/todo.md`](src/todo.md) for project notes and roadmap.
- API documentation is available at `/docs` after running the server.

---

**Author:** ofins
**License:** ISC
