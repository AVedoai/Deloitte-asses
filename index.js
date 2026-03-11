/**
 * Smart LMS API - Main Server Entry Point
 * Built for Deloitte Graduate Hiring Assessment 2025
 * Author: Prem Shinde
 * Email: shindeprem102@gmail.com
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

const swaggerSpec = require('./config/swagger');
const { getLogger } = require('./middleware/logger');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { seedAllData } = require('./utils/seedData');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const lessonRoutes = require('./routes/lessonRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const progressRoutes = require('./routes/progressRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const studentRoutes = require('./routes/studentRoutes');

// Initialize Express application
const app = express();

// CORS Configuration - Allow Swagger and all origins (for Replit deployment)
const corsOptions = {
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(getLogger());

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     security: []
 *     responses:
 *       200:
 *         description: Server is running
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Smart LMS API is running',
    timestamp: new Date().toISOString()
  });
});

// Swagger API Documentation
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customSiteTitle: 'Smart LMS API Documentation',
    customCss: '.swagger-ui .topbar { display: none }'
  })
);

// API Routes
app.use('/auth', authRoutes);
app.use('/courses', courseRoutes);
app.use('/courses', lessonRoutes);
app.use('/enrollments', enrollmentRoutes);
app.use('/progress', progressRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/students', studentRoutes);

// Root Route - Redirect to Documentation
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Server Configuration
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Start Server
const server = app.listen(PORT, () => {
  console.log('------------------------------------------------------------');
  console.log('Smart LMS API Server Started');
  console.log(`Environment: ${NODE_ENV}`);
  console.log(`Server URL: http://localhost:${PORT}`);
  console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`Health Check: http://localhost:${PORT}/health`);
  console.log('------------------------------------------------------------');

  // Load Seed Data (Optional)
  if (process.env.LOAD_SEED_DATA === 'true') {
    console.log('Loading seed data...');
    seedAllData();

    console.log('Seed data loaded successfully.');
    console.log('Test Credentials:');
    console.log('Admin: admin@lms.com / admin123');
    console.log('Instructor: instructor1@lms.com / instructor123');
    console.log('Student: student1@lms.com / student123');
  }
});

// Graceful Shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Closing HTTP server.');
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
});

module.exports = app;