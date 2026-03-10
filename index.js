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
const open = require('open');

// Import routes
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const lessonRoutes = require('./routes/lessonRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const progressRoutes = require('./routes/progressRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const studentRoutes = require('./routes/studentRoutes');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(getLogger());

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: Date.now(),
    message: 'Smart LMS API is running'
  });
});

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customSiteTitle: 'Smart LMS API Documentation',
  customCss: '.swagger-ui .topbar { display: none }'
}));

// Mount API routes
app.use('/auth', authRoutes);
app.use('/courses', courseRoutes);
app.use('/courses', lessonRoutes);
app.use('/enrollments', enrollmentRoutes);
app.use('/progress', progressRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/students', studentRoutes);

// Root endpoint
// app.get('/', (req, res) => {
//   res.status(200).json({
//     message: 'Welcome to Smart LMS API',
//     version: '1.0.0',
//     author: 'Prem Shinde',
//     documentation: '/api-docs',
//     health: '/health'
//   });
// });
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Server configuration
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Start server
const server = app.listen(PORT, async () => {
  console.log('='.repeat(50));
  console.log(`🚀 Smart LMS API Server Started`);
  console.log(`📍 Environment: ${NODE_ENV}`);
  console.log(`🌐 Server running on: http://localhost:${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`❤️  Health Check: http://localhost:${PORT}/health`);
  console.log('='.repeat(50));

  // Explicitly open both routes
  await open(`http://localhost:${PORT}/api-docs`);
  await open(`http://localhost:${PORT}`);

  // Load seed data if enabled
  if (process.env.LOAD_SEED_DATA === 'true') {
    console.log('\n🌱 Loading seed data...\n');
    seedAllData();
    console.log('\n✅ Seed data loaded successfully!\n');
    console.log('Test Credentials:');
    console.log('  Admin: admin@lms.com / admin123');
    console.log('  Instructor: instructor1@lms.com / instructor123');
    console.log('  Student: student1@lms.com / student123\n');
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('✅ HTTP server closed');
  });
});

module.exports = app;
