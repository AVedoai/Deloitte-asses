/**
 * Global Error Handler Middleware
 * Catches and formats all errors consistently
 */

const { HTTP_STATUS, ERROR_MESSAGES } = require('../config/constants');

/**
 * Custom error class for application errors
 */
class AppError extends Error {
  constructor(message, statusCode, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global error handling middleware
 * Must be the last middleware in the chain
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;

  // Log error for debugging (in production, use proper logging service)
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }

  // Mongoose/MongoDB errors (if using database in future)
  if (err.name === 'CastError') {
    error.message = 'Resource not found';
    error.statusCode = HTTP_STATUS.NOT_FOUND;
  }

  if (err.code === 11000) {
    error.message = 'Duplicate field value';
    error.statusCode = HTTP_STATUS.CONFLICT;
  }

  if (err.name === 'ValidationError') {
    error.message = 'Validation error';
    error.statusCode = HTTP_STATUS.BAD_REQUEST;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token';
    error.statusCode = HTTP_STATUS.UNAUTHORIZED;
  }

  if (err.name === 'TokenExpiredError') {
    error.message = 'Token expired';
    error.statusCode = HTTP_STATUS.UNAUTHORIZED;
  }

  // Response format
  const response = {
    success: false,
    message: error.message || ERROR_MESSAGES.SERVER_ERROR,
    errors: error.errors || []
  };

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(error.statusCode).json(response);
};

/**
 * Handle 404 errors (route not found)
 */
const notFound = (req, res, next) => {
  const error = new AppError(
    `Route not found: ${req.originalUrl}`,
    HTTP_STATUS.NOT_FOUND,
    [{ field: 'route', message: 'The requested endpoint does not exist' }]
  );
  next(error);
};

/**
 * Async error wrapper
 * Wraps async route handlers to catch errors
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  AppError,
  errorHandler,
  notFound,
  asyncHandler
};
