const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Smart LMS API',
      version: '1.0.0',
      description: `
A comprehensive Learning Management System backend API built with Node.js and Express.

------------------------------
🔐 AUTHORIZATION INSTRUCTIONS
------------------------------

Before calling protected APIs you must authorize.

1️⃣ Click the **Authorize** button in the top right of Swagger UI.

2️⃣ Under **bearerAuth (http, Bearer)** enter:

Bearer YOUR_TOKEN

3️⃣ Click **Authorize** then **Close**.

------------------------------
🔑 HOW TO GET TOKEN
------------------------------

First login using:

POST /auth/login

Example Request:

{
  "email": "admin@lms.com",
  "password": "admin123"
}

The API will return a JWT token.

Copy the token and use it in the **Authorize** button.

------------------------------
🧪 TEST USERS (Seed Data)
------------------------------

Admin  
email: admin@lms.com  
password: admin123  

Instructor  
email: instructor1@lms.com  
password: instructor123  

Student  
email: student1@lms.com  
password: student123  

------------------------------
⚠️ NOTE
------------------------------

Login and Register APIs **do not require authorization**.
All other APIs require Bearer Token authentication.

------------------------------
✨ FEATURES
------------------------------

- JWT-based Authentication & Authorization
- Course Management (CRUD operations)
- Lesson Management with ordering
- Student Enrollment System
- Progress Tracking & Analytics
- Role-Based Access Control (Admin, Instructor, Student)
- Interactive API Documentation
      `,
      contact: {
        name: 'Prem Shinde',
        email: 'shindeprem102@gmail.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'https://deloitte-assesment--shindepremwork.replit.app',
        description: 'Production server (Replit)'
      },
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format: Bearer YOUR_TOKEN'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'usr_1234567890' },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            role: { type: 'string', enum: ['student', 'instructor', 'admin'], example: 'student' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Course: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'crs_1234567890' },
            title: { type: 'string', example: 'Introduction to Node.js' },
            description: { type: 'string', example: 'Learn Node.js from scratch' },
            instructor: { type: 'string', example: 'Dr. Jane Smith' },
            instructorId: { type: 'string', example: 'usr_9876543210' },
            category: { type: 'string', example: 'Web Development' },
            level: { type: 'string', enum: ['beginner', 'intermediate', 'advanced'], example: 'beginner' },
            duration: { type: 'number', example: 40, description: 'Total duration in hours' },
            thumbnail: { type: 'string', example: 'https://example.com/image.jpg' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Lesson: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'lsn_1234567890' },
            courseId: { type: 'string', example: 'crs_1234567890' },
            title: { type: 'string', example: 'Getting Started with Node.js' },
            description: { type: 'string', example: 'Learn the basics of Node.js' },
            content: { type: 'string', example: 'Node.js is a JavaScript runtime...' },
            duration: { type: 'number', example: 45, description: 'Duration in minutes' },
            order: { type: 'number', example: 1, description: 'Lesson sequence number' },
            videoUrl: { type: 'string', example: 'https://example.com/video.mp4' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Enrollment: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'enr_1234567890' },
            studentId: { type: 'string', example: 'usr_1234567890' },
            courseId: { type: 'string', example: 'crs_1234567890' },
            enrolledAt: { type: 'string', format: 'date-time' },
            status: { type: 'string', enum: ['active', 'completed', 'dropped'], example: 'active' }
          }
        },
        Progress: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'prg_1234567890' },
            studentId: { type: 'string', example: 'usr_1234567890' },
            courseId: { type: 'string', example: 'crs_1234567890' },
            lessonId: { type: 'string', example: 'lsn_1234567890' },
            completedAt: { type: 'string', format: 'date-time' },
            timeSpent: { type: 'number', example: 35, description: 'Time spent in minutes' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error message' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string', example: 'email' },
                  message: { type: 'string', example: 'Invalid email format' }
                }
              }
            }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Operation successful' },
            data: { type: 'object' }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'User registration, login, and token management'
      },
      {
        name: 'Courses',
        description: 'Course management operations'
      },
      {
        name: 'Lessons',
        description: 'Lesson management within courses'
      },
      {
        name: 'Enrollments',
        description: 'Student course enrollment operations'
      },
      {
        name: 'Progress',
        description: 'Learning progress tracking'
      },
      {
        name: 'Students',
        description: 'Student profile management'
      },
      {
        name: 'Dashboard',
        description: 'Analytics and dashboard endpoints'
      },
      {
        name: 'Health',
        description: 'API health check'
      }
    ]
  },
  apis: ['./routes/*.js', './index.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;