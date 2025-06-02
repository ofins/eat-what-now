# Eat What Now - Monorepo

This repository contains both the **backend server** and **frontend client** projects for the Eat What Now application.

## Project Structure

- **/server**: Node.js/TypeScript backend API

  - Handles authentication, user management, restaurant data, and API documentation (Swagger).
  - Uses PostgreSQL, Docker Compose, pg-promise, and Zod for validation.
  - See [`server/readme.md`](server/readme.md) for setup, environment variables, and API usage details.

- **/client**: React TypeScript frontend
  - Provides the user interface for authentication, browsing restaurants, and user actions.
  - Built with Vite for fast development and modern tooling.
  - See [`client/README.md`](client/README.md) for setup, available scripts, and usage instructions.

## Getting Started

```bash
nvm use 20
npm install

cp server/.env.example server/.env
cp client/.env.example client/.env

npm run dev
```

This will start both the backend API and frontend app concurrently.

**For more details**

- See [`server/readme.md`](server/readme.md) for backend setup, environment variables, and API documentation.
- See [`client/README.md`](client/README.md) for frontend setup and usage.

---

For any issues or contributions, please refer to the individual project readme files or open an issue in this repository.
