

module.exports = {
  // User Roles
  ROLES: {
    ADMIN: 'admin',
    INSTRUCTOR: 'instructor',
    STUDENT: 'student'
  },

  // Enrollment Status
  ENROLLMENT_STATUS: {
    ACTIVE: 'active',
    COMPLETED: 'completed',
    DROPPED: 'dropped'
  },

  // Course Levels
  COURSE_LEVELS: {
    BEGINNER: 'beginner',
    INTERMEDIATE: 'intermediate',
    ADVANCED: 'advanced'
  },

  // HTTP Status Codes
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500
  },

  // Error Messages
  ERROR_MESSAGES: {
    UNAUTHORIZED: 'Authentication required. Please provide a valid token.',
    FORBIDDEN: 'You do not have permission to perform this action.',
    NOT_FOUND: 'The requested resource was not found.',
    INVALID_CREDENTIALS: 'Invalid email or password.',
    EMAIL_EXISTS: 'Email already registered.',
    VALIDATION_ERROR: 'Validation failed. Please check your input.',
    SERVER_ERROR: 'An unexpected error occurred. Please try again later.'
  },

  // Success Messages
  SUCCESS_MESSAGES: {
    REGISTERED: 'User registered successfully.',
    LOGIN: 'Login successful.',
    CREATED: 'Resource created successfully.',
    UPDATED: 'Resource updated successfully.',
    DELETED: 'Resource deleted successfully.',
    ENROLLED: 'Successfully enrolled in the course.',
    PROGRESS_UPDATED: 'Progress updated successfully.'
  },

  // Pagination
  PAGINATION: {
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
    DEFAULT_OFFSET: 0
  },

  // Token Types
  TOKEN_TYPES: {
    ACCESS: 'access',
    REFRESH: 'refresh'
  }
};
