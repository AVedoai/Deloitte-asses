/**
 * Authentication Middleware
 * Verifies JWT tokens and attaches user information to request
 */

const jwt = require('jsonwebtoken');
const { HTTP_STATUS, ERROR_MESSAGES } = require('../config/constants');

/**
 * Verify JWT token and authenticate user
 * Adds user object to request (req.user)
 */
const authenticate = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: ERROR_MESSAGES.UNAUTHORIZED,
        errors: [{ field: 'authorization', message: 'Missing or invalid authorization header' }]
      });
    }

    // Extract token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: ERROR_MESSAGES.UNAUTHORIZED,
        errors: [{ field: 'token', message: 'Token not provided' }]
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user information to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };

    next();
  } catch (error) {
    // Handle JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: 'Invalid token',
        errors: [{ field: 'token', message: 'Token is malformed or invalid' }]
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: 'Token expired',
        errors: [{ field: 'token', message: 'Token has expired. Please login again.' }]
      });
    }

    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: ERROR_MESSAGES.UNAUTHORIZED,
      errors: [{ field: 'authentication', message: error.message }]
    });
  }
};

/**
 * Optional authentication - doesn't fail if no token provided
 * Used for endpoints that work differently for authenticated vs anonymous users
 */
const optionalAuthenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role
      };
    }

    next();
  } catch (error) {
    // Silently fail - user remains unauthenticated
    next();
  }
};

module.exports = {
  authenticate,
  optionalAuthenticate
};
