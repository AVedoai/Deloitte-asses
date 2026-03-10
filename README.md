# 🎓 Smart LMS API - Learning Management System

A production-grade RESTful API for managing online courses, student enrollments, and learning progress tracking. Built with Node.js and Express.js featuring JWT authentication, role-based access control, and comprehensive API documentation.

---

## 📋 Personal Details

**Full Name:** Prem Shinde  
**Email ID:** shindeprem102@gmail.com  
**College Name:** Dnyanshree Institute Of Engineering And Technology  
**Selected Skill Track:** Java & API Development (Node.js)

---

## ✨ Features

- 🔐 **JWT Authentication** - Secure token-based authentication with refresh tokens
- 👥 **Role-Based Access Control** - Three user roles (Admin, Instructor, Student)
- 📚 **Course Management** - Complete CRUD operations for courses and lessons
- 👨‍🎓 **Student Enrollment** - Enroll students in courses, track enrollment status
- 📊 **Progress Tracking** - Monitor lesson completion and learning progress
- 📈 **Analytics Dashboard** - Role-specific dashboards with detailed statistics
- ✅ **Input Validation** - Comprehensive request validation using express-validator
- 📄 **Interactive API Documentation** - Swagger/OpenAPI 3.0 specification
- 🛡️ **Error Handling** - Centralized error handling with meaningful responses
- 📝 **Request Logging** - HTTP request logging with Morgan
- 🌱 **Seed Data** - Pre-populated test data for quick testing

---

## 🛠️ Tech Stack

### Core Technologies
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **JWT (jsonwebtoken)** - Secure authentication
- **bcryptjs** - Password hashing

### Validation & Documentation
- **express-validator** - Request validation
- **swagger-ui-express** - API documentation UI
- **swagger-jsdoc** - Swagger specification generator

### Utilities
- **cors** - Cross-Origin Resource Sharing
- **morgan** - HTTP request logger
- **dotenv** - Environment variable management
- **nodemon** - Development auto-reload (devDependency)

---

## 📁 Project Structure

```
smart-lms-api/
├── config/
│   ├── constants.js          # Application constants (roles, status codes, messages)
│   └── swagger.js             # Swagger/OpenAPI configuration
├── controllers/
│   ├── authController.js      # Authentication logic (register, login, refresh)
│   ├── courseController.js    # Course management operations
│   ├── lessonController.js    # Lesson CRUD operations
│   ├── enrollmentController.js # Enrollment management
│   ├── progressController.js  # Progress tracking
│   ├── dashboardController.js # Analytics and statistics
│   └── studentController.js   # Student profile management
├── middleware/
│   ├── authMiddleware.js      # JWT verification
│   ├── roleMiddleware.js      # Role-based authorization
│   ├── errorHandler.js        # Global error handling
│   ├── validator.js           # Validation result checker
│   └── logger.js              # Request logging configuration
├── models/
│   ├── userModel.js           # User data management
│   ├── courseModel.js         # Course data operations
│   ├── lessonModel.js         # Lesson data management
│   ├── enrollmentModel.js     # Enrollment tracking
│   └── progressModel.js       # Progress records
├── routes/
│   ├── authRoutes.js          # Authentication endpoints
│   ├── courseRoutes.js        # Course endpoints
│   ├── lessonRoutes.js        # Lesson endpoints
│   ├── enrollmentRoutes.js    # Enrollment endpoints
│   ├── progressRoutes.js      # Progress endpoints
│   ├── dashboardRoutes.js     # Dashboard endpoints
│   └── studentRoutes.js       # Student endpoints
├── utils/
│   ├── jwtHelper.js           # JWT token utilities
│   ├── responseFormatter.js   # Standardized API responses
│   └── seedData.js            # Database seeding script
├── .env                       # Environment variables
├── .env.example               # Environment template
├── .gitignore                 # Git ignore rules
├── index.js                   # Main server entry point
├── package.json               # Project dependencies
└── README.md                  # This file
```

---

## 🏗️ Architecture

**Design Pattern:** MVC (Model-View-Controller)

- **Models** - Data management and business logic
- **Controllers** - Request handlers and business operations
- **Routes** - API endpoint definitions and validation
- **Middleware** - Authentication, authorization, validation, error handling
- **Utils** - Helper functions and utilities

**Data Storage:** In-memory arrays/objects (suitable for demonstration purposes)

**Authentication Flow:**
1. User registers/logs in → Server generates JWT access & refresh tokens
2. Client stores tokens and sends access token in `Authorization: Bearer <token>` header
3. Server verifies token on protected routes → Grants/denies access
4. When access token expires → Client uses refresh token to get new tokens

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14.0.0 or higher)
- npm (Node Package Manager)

### Installation

1. **Clone or download the project**
   ```bash
   cd smart-lms-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Copy .env.example to .env
   cp .env.example .env
   
   # Edit .env file with your configuration
   ```

4. **Start the server**
   ```bash
   # Production mode
   npm start
   
   # Development mode with auto-reload
   npm run dev
   ```

5. **Verify server is running**
   - Open browser: http://localhost:3000/health
   - Expected response: `{"status":"ok","timestamp":1234567890,"message":"Smart LMS API is running"}`

6. **Access API Documentation**
   - Open browser: http://localhost:3000/api-docs
   - Interactive Swagger UI with all endpoints documented

---

## 🔐 Test Credentials

The API comes with pre-populated test data (when `LOAD_SEED_DATA=true`):

### Admin Account
```
Email: admin@lms.com
Password: admin123
Role: Admin
```

### Instructor Accounts
```
Email: instructor1@lms.com
Password: instructor123
Role: Instructor
```

### Student Accounts
```
Email: student1@lms.com
Password: student123
Role: Student
```

**Note:** Additional test accounts are available in [utils/seedData.js](utils/seedData.js)

---

## 📡 API Endpoints Summary

### Authentication (`/auth`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | User login | No |
| POST | `/auth/refresh` | Refresh access token | No |
| GET | `/auth/me` | Get current user profile | Yes |
| PUT | `/auth/change-password` | Change password | Yes |

### Courses (`/courses`)
| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/courses` | Get all courses (with filters) | No | - |
| GET | `/courses/:id` | Get course by ID | No | - |
| POST | `/courses` | Create new course | Yes | Instructor, Admin |
| PUT | `/courses/:id` | Update course | Yes | Instructor (owner), Admin |
| DELETE | `/courses/:id` | Delete course | Yes | Admin |
| GET | `/courses/:id/stats` | Get course statistics | No | - |

### Lessons (`/courses`, `/lessons`)
| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| POST | `/courses/:courseId/lessons` | Add lesson to course | Yes | Instructor (owner), Admin |
| GET | `/courses/:courseId/lessons` | Get all lessons in course | No | - |
| GET | `/lessons/:id` | Get lesson by ID | No | - |
| PUT | `/lessons/:id` | Update lesson | Yes | Instructor (owner), Admin |
| DELETE | `/lessons/:id` | Delete lesson | Yes | Instructor (owner), Admin |

### Enrollments (`/enrollments`)
| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| POST | `/enrollments` | Enroll in course | Yes | Student, Admin |
| GET | `/enrollments/student/:studentId` | Get student enrollments | Yes | Student (own), Admin |
| GET | `/enrollments/course/:courseId` | Get course enrollments | Yes | Instructor (owner), Admin |
| PUT | `/enrollments/:id` | Update enrollment status | Yes | Student, Admin |
| DELETE | `/enrollments/:id` | Unenroll from course | Yes | Student, Admin |

### Progress (`/progress`)
| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| POST | `/progress` | Mark lesson complete | Yes | Student |
| GET | `/progress/student/:studentId` | Get student overall progress | Yes | Student (own), Admin |
| GET | `/progress/course/:courseId/student/:studentId` | Get course progress | Yes | Student (own), Instructor (owner), Admin |

### Dashboard (`/dashboard`)
| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/dashboard/admin` | Admin dashboard | Yes | Admin |
| GET | `/dashboard/student/:id` | Student dashboard | Yes | Student (own), Admin |
| GET | `/dashboard/instructor/:id` | Instructor dashboard | Yes | Instructor (own), Admin |

### Students (`/students`)
| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/students` | Get all students | Yes | Admin |
| GET | `/students/:id` | Get student profile | Yes | Student (own), Admin |
| PUT | `/students/:id` | Update student profile | Yes | Student (own), Admin |
| GET | `/students/:id/courses` | Get student courses | Yes | Student (own), Admin |
| DELETE | `/students/:id` | Delete student account | Yes | Admin |

### Health (`/health`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/health` | Health check | No |

**Total Endpoints:** 36

---

## 🧪 Quick Start Testing

### Step 1: Register a New User
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "student"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user-xxx",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Step 2: Login with Test Account
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student1@lms.com",
    "password": "student123"
  }'
```

### Step 3: Get All Courses (Public)
```bash
curl -X GET http://localhost:3000/courses
```

### Step 4: Access Protected Route (Use token from login)
```bash
curl -X GET http://localhost:3000/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

### Step 5: Enroll in a Course
```bash
curl -X POST http://localhost:3000/enrollments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -d '{
    "courseId": "course-1"
  }'
```

### Step 6: Mark Lesson as Complete
```bash
curl -X POST http://localhost:3000/progress \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -d '{
    "courseId": "course-1",
    "lessonId": "lesson-1",
    "timeSpent": 45
  }'
```

---

## ⚙️ Environment Variables

Create a `.env` file in the project root:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=24h
JWT_REFRESH_EXPIRE=7d

# Application
APP_NAME=Smart LMS API
LOAD_SEED_DATA=true
```

### Variable Descriptions:
- `PORT` - Server port number (default: 3000)
- `NODE_ENV` - Environment mode (development/production)
- `JWT_SECRET` - Secret key for JWT token signing (use strong random string in production)
- `JWT_EXPIRE` - Access token expiration time
- `JWT_REFRESH_EXPIRE` - Refresh token expiration time
- `APP_NAME` - Application name for logging
- `LOAD_SEED_DATA` - Load sample data on server start (true/false)

---

## 🎯 Key Features Explained

### Role-Based Access Control (RBAC)
Three user roles with hierarchical permissions:
- **Admin** - Full system access, manage all users and courses
- **Instructor** - Create and manage own courses, view enrolled students
- **Student** - Enroll in courses, track progress, view own data

### Authentication Flow
1. **Register/Login** → Receive JWT access token (24h) and refresh token (7d)
2. **Access Protected Routes** → Send token in `Authorization: Bearer <token>` header
3. **Token Expires** → Use refresh token to get new access token
4. **Logout** → Client discards tokens (stateless JWT)

### Progress Tracking System
- Students mark lessons as complete
- System calculates course completion percentage
- Auto-completes enrollment when all lessons finished
- Tracks time spent on each lesson
- Dashboard displays overall learning statistics

### Input Validation
All endpoints with request body/params have validation:
- Email format validation
- Password strength requirements (minimum 6 characters)
- Required field checks
- Data type validation (numeric IDs, durations)
- Enum validation (roles, levels, status)

### Error Handling
Consistent error responses with appropriate HTTP status codes:
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (duplicate entry)
- `500` - Internal Server Error

---

## 📊 Database Schema (In-Memory)

### User
```javascript
{
  id: string,
  name: string,
  email: string,
  password: string (hashed),
  role: 'admin' | 'instructor' | 'student',
  createdAt: Date
}
```

### Course
```javascript
{
  id: string,
  title: string,
  description: string,
  instructorId: string,
  instructorName: string,
  category: string,
  level: 'beginner' | 'intermediate' | 'advanced',
  duration: number (hours),
  thumbnail: string (URL),
  createdAt: Date,
  updatedAt: Date
}
```

### Lesson
```javascript
{
  id: string,
  courseId: string,
  title: string,
  description: string,
  content: string,
  videoUrl: string,
  duration: number (minutes),
  order: number,
  createdAt: Date
}
```

### Enrollment
```javascript
{
  id: string,
  studentId: string,
  courseId: string,
  status: 'active' | 'completed' | 'dropped',
  enrolledAt: Date,
  completedAt: Date
}
```

### Progress
```javascript
{
  id: string,
  studentId: string,
  courseId: string,
  lessonId: string,
  completed: boolean,
  timeSpent: number (minutes),
  completedAt: Date
}
```



**Built with ❤️ by Prem Shinde**

