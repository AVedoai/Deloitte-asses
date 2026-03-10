/**
 * Request Validation Middleware
 * Uses express-validator to validate request data
 */

const { validationResult } = require('express-validator');
const { HTTP_STATUS, ERROR_MESSAGES } = require('../config/constants');

/**
 * Check validation results and return errors if any
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: error.path || error.param,
      message: error.msg,
      value: error.value
    }));

    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: ERROR_MESSAGES.VALIDATION_ERROR,
      errors: formattedErrors
    });
  }

  next();
};

module.exports = { validate };
