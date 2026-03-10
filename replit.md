# Smart LMS API

A production-grade Learning Management System (LMS) backend built with Node.js and Express.

## Architecture

- **Runtime**: Node.js
- **Framework**: Express.js
- **Auth**: JWT (jsonwebtoken + bcryptjs)
- **Validation**: express-validator
- **API Docs**: Swagger UI (swagger-jsdoc + swagger-ui-express)
- **Storage**: In-memory (no external database)
- **Port**: 5000

## Project Structure

```
index.js              - Main server entry point
config/
  constants.js        - App constants
  swagger.js          - Swagger/OpenAPI config
controllers/          - Route handler logic
middleware/           - Auth, error handling, logging, validation
models/               - In-memory data models
routes/               - Express route definitions
utils/
  jwtHelper.js        - JWT utility functions
  responseFormatter.js - Standardized API responses
  seedData.js         - Sample data seeder
```

## API Endpoints

- `GET /` - Welcome / root
- `GET /health` - Health check
- `GET /api-docs` - Swagger UI documentation
- `POST /auth/...` - Authentication routes
- `GET/POST /courses` - Course management
- `GET/POST /courses/:id/lessons` - Lesson management
- `GET/POST /enrollments` - Enrollment management
- `GET/POST /progress` - Progress tracking
- `GET /dashboard` - Dashboard data
- `GET /students` - Student management

## Environment Variables

- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRE` - JWT token expiry (default: 24h)
- `JWT_REFRESH_EXPIRE` - Refresh token expiry (default: 7d)
- `LOAD_SEED_DATA` - Set to "true" to load sample data on startup

## Test Credentials (when LOAD_SEED_DATA=true)

- Admin: `admin@lms.com` / `admin123`
- Instructor: `instructor1@lms.com` / `instructor123`
- Student: `student1@lms.com` / `student123`
