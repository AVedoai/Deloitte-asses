/**
 * Request Logger Middleware
 * Configures Morgan for HTTP request logging
 */

const morgan = require('morgan');

/**
 * Get Morgan logger based on environment
 */
const getLogger = () => {
  // In development, use detailed 'dev' format
  // In production, use 'combined' format (Apache-style)
  const format = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';

  return morgan(format, {
    // Skip logging for health check endpoint to reduce noise
    skip: (req, res) => req.url === '/health'
  });
};

/**
 * Custom Morgan token for user ID (if authenticated)
 */
morgan.token('user-id', (req) => {
  return req.user ? req.user.id : 'anonymous';
});

/**
 * Custom Morgan token for user role (if authenticated)
 */
morgan.token('user-role', (req) => {
  return req.user ? req.user.role : 'guest';
});

/**
 * Custom format with user information
 * Usage: morgan(customFormat)
 */
const customFormat = ':method :url :status :response-time ms - :user-id (:user-role)';

module.exports = {
  getLogger,
  customFormat
};
