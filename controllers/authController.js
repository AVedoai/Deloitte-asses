

const userModel = require('../models/userModel');
const { generateTokens, verifyToken } = require('../utils/jwtHelper');
const {
  successResponse,
  createdResponse,
  badRequestResponse,
  unauthorizedResponse,
  conflictResponse
} = require('../utils/responseFormatter');
const { SUCCESS_MESSAGES, ERROR_MESSAGES } = require('../config/constants');


const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;


    const existingUser = userModel.findByEmail(email);
    if (existingUser) {
      return conflictResponse(res, ERROR_MESSAGES.EMAIL_EXISTS);
    }

    // Create user
    const user = await userModel.createUser({ name, email, password, role: role || 'student' });

    // Generate tokens
    const tokens = generateTokens(user);

    // Response
    return createdResponse(res, SUCCESS_MESSAGES.REGISTERED, {
      user,
      ...tokens
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 * @route POST /auth/login
 * @access Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Authenticate user
    const user = await userModel.authenticate(email, password);

    if (!user) {
      return unauthorizedResponse(res, ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    // Generate tokens
    const tokens = generateTokens(user);

    // Response
    return successResponse(res, 200, SUCCESS_MESSAGES.LOGIN, {
      user,
      ...tokens
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Refresh access token
 * @route POST /auth/refresh
 * @access Public
 */
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return badRequestResponse(res, 'Refresh token is required', [
        { field: 'refreshToken', message: 'Refresh token must be provided' }
      ]);
    }

    // Verify refresh token
    let decoded;
    try {
      decoded = verifyToken(refreshToken);
    } catch (error) {
      return unauthorizedResponse(res, 'Invalid or expired refresh token');
    }

    // Get user
    const user = userModel.findById(decoded.id);
    if (!user) {
      return unauthorizedResponse(res, 'User not found');
    }

    // Generate new tokens
    const tokens = generateTokens(user);

    return successResponse(res, 200, 'Token refreshed successfully', {
      user,
      ...tokens
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user profile
 * @route GET /auth/me
 * @access Private
 */
const getMe = async (req, res, next) => {
  try {
    const user = userModel.findById(req.user.id);

    if (!user) {
      return unauthorizedResponse(res, 'User not found');
    }

    return successResponse(res, 200, 'User profile retrieved', user);
  } catch (error) {
    next(error);
  }
};

/**
 * Change password
 * @route PUT /auth/change-password
 * @access Private
 */
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = userModel.findByEmail(req.user.email);
    if (!user) {
      return unauthorizedResponse(res, 'User not found');
    }

    // Verify current password
    const isMatch = await userModel.comparePassword(currentPassword, user.password);
    if (!isMatch) {
      return unauthorizedResponse(res, 'Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await userModel.hashPassword(newPassword);

    // Update password (you would need to add this method to userModel)
    user.password = hashedPassword;

    return successResponse(res, 200, 'Password changed successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  getMe,
  changePassword
};
