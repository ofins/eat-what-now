# To-Do List

## Bug Issues

- [ ] Unable to connect to Docker DB using dbeaver (6.4.2025)
- [ ] Application shuts down if errors are thrown in creating DB (5.30.2025)
  - `try/catch` blocks are used and issue still occurs
- [x] Docker compose up throwing error (5.17.2025)

## Backend Development

- [ ] Setup Logger for API and DB
- [ ] Chaos engineering to test resilience
- [ ] Implement unit testing using Jest
- [ ] Implement rate limiting to prevent abuse
- [ ] Reviews management endpoints CRUD
- [ ] Implement load balancing
- [ ] Protect against common vulnerabilities (SQL Injections, XSS, CSRF)
- [ ] Cache mechanism (Redis)
- [ ] Add logging
- [x] Add and `website` column for restaurant
- [x] Move `types` to root level packages to share with client and server
- [x] Setup `/users/profile` and ensure user can only access own data
- [x] Integrate Schema validation
- [x] Setup `/login` and `/register` API with JWT
- [x] Setup `/restaurants` API
- [x] Setup `/user` API
- [x] Setup CRUD functionality for `/feed` API
- [x] Containerize server/Db with Docker
- [x] Implement Type-ORM

## Database Tasks

- [ ] Explore basic failure mechanism to integrate in DB
- [ ] Ensure database has proper normalization technique
- [ ] Setup caching system - Redis
- [ ] Optimize PostGIS queries for location-based searches
- [ ] Create database backup script
- [x] Setup a form of migration
- [x] Setup `restaurants-users` table
- [x] Setup `users` and `restaurants` table
- [x] Implement initial DB data with migration
- [x] Initialize PostgreSQL database

## DevOps Tasks

- [ ] Setup basic Nginx for distribution of loads
- [ ] Host server on AWS
- [ ] Setup CDN for static assets
- [ ] Test PROD env
- [ ] Setup site via AWS ECS with Docker
- [ ] Purchase domain
- [ ] Setup CI/CD pipeline in Github Actions

## Documentation

- [ ] Document authentication middleware usage
- [x] Write README.md for project setup instructions
- [x] Integrate Swagger for API documentation

## Refactoring

- [ ] Refactor `GET /feed` to support filtering by cuisine
- [x] Use absolute paths with `tsc-alias`
- [x] Set up DI container with `tsyringe`
