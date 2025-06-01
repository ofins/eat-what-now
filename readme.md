# Eat What Now - Monorepo

This repository contains both the **backend server** and **frontend client** projects for the Eat What Now application.

## Project Structure

- **/server**: Node.js/TypeScript backend API

  - Handles authentication, user management, restaurant data, and API documentation (Swagger).
  - Uses PostgreSQL, Docker Compose, TypeORM, pg-promise, and Zod for validation.
  - See [`server/readme.md`](server/readme.md) for setup, environment variables, and API usage details.

- **/client**: React TypeScript frontend
  - Provides the user interface for authentication, browsing restaurants, and user actions.
  - Built with Vite for fast development and modern tooling.
  - See [`client/README.md`](client/README.md) for setup, available scripts, and usage instructions.

## Getting Started

1. **Install dependencies**

   ```powershell
   npm install
   ```

2. **Run both client and server in development**

   ```powershell
   npm run dev
   ```

   This will start both the backend API and frontend app concurrently.

3. **For more details**
   - See [`server/readme.md`](server/readme.md) for backend setup, environment variables, and API documentation.
   - See [`client/README.md`](client/README.md) for frontend setup and usage.

---

For any issues or contributions, please refer to the individual project readme files or open an issue in this repository.
