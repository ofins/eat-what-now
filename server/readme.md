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
- **Feed API**: Location-based, filterable restaurant feed with geospatial queries
- **PostGIS Integration**: Spatial database for geographic data and location-based searches
- **Restaurant-User Join Table**: Track upvotes, favorites, ratings, comments, and visits
- **Google Places API**: Search and import restaurants from Google Places
- **Swagger API Docs**: `/docs` endpoint
- **PostgreSQL**: Data storage with migrations/seed using `Knex.js`
- **CRON Jobs**: Aggregates restaurant stats hourly

## Tech Stack

- Node.js, Express, TypeScript
- PostgreSQL with PostGIS extension for geospatial data
- pg-promise for database operations
- JWT for authentication
- Google Places API for restaurant search and import
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
GOOGLE_API_KEY=your_google_places_api_key
```

### Local Development - Getting started

```sh
nvm use
npm ci

cp .env.example .env

npm run migrate:up
npm run seed # optional
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
- `POST /restaurants/google/search-by-text` — Search restaurants using Google Places API

### Feed

- `GET /feed` — Get a randomized, filterable feed of restaurants (supports location, cuisine, price, rating, etc.)

### Restaurant-User Actions

- `POST /restaurants/user` — Upvote, favorite, rate, comment, or mark as visited
- `POST /restaurants/user/upvote` — Toggle upvote for a restaurant

## Authentication

- **API Key**: Pass `x-signature` header with your API key for protected endpoints
- **JWT**: Pass `Authorization: Bearer <token>` for user-protected endpoints

## Database

- Tables: `users`, `restaurants`, `restaurant_user`, `restaurants_daily_feed`
- PostGIS extension enabled for geospatial functionality
- Restaurants include geometry column (`geom`) for location-based queries
- Spatial indexing with GIST for efficient geographic searches
- Seed data is loaded on first run
- Aggregated stats (upvotes) are updated hourly via CRON

## PostGIS Features

This backend leverages PostgreSQL's PostGIS extension for advanced geospatial capabilities:

### 🌍 **Spatial Data Storage**

- Restaurant locations stored as `GEOMETRY(Point, 4326)` using WGS84 coordinate system
- Automatic geometry column updates via database triggers
- Coordinate validation for latitude (-90 to 90) and longitude (-180 to 180)

### 📍 **Location-Based Queries**

- Distance calculations using `ST_Distance` and `ST_DWithin`
- Radius-based restaurant searches (e.g., "restaurants within 5km")
- Efficient spatial indexing with GIST for fast geographic queries

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
