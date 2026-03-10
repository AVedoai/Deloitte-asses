

const { HTTP_STATUS, ERROR_MESSAGES, ROLES } = require('../config/constants');


const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // Check if user is authenticated (should be set by authenticate middleware)
    if (!req.user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: ERROR_MESSAGES.UNAUTHORIZED,
        errors: [{ field: 'authentication', message: 'User not authenticated' }]
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: ERROR_MESSAGES.FORBIDDEN,
        errors: [{
          field: 'authorization',
          message: `This action requires one of the following roles: ${allowedRoles.join(', ')}`
        }]
      });
    }

    next();
  };
};

const isAdmin = authorize(ROLES.ADMIN);

/**
 * Check if user is an instructor or admin
 */
const isInstructorOrAdmin = authorize(ROLES.INSTRUCTOR, ROLES.ADMIN);

/**
 * Check if user is a student
 */
const isStudent = authorize(ROLES.STUDENT);

/**
 * Check if user owns the resource or is admin
 * Requires resourceId and userIdField parameters
 */
const isOwnerOrAdmin = (getUserIdFromRequest) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: ERROR_MESSAGES.UNAUTHORIZED
      });
    }

    // Admins can access any resource
    if (req.user.role === ROLES.ADMIN) {
      return next();
    }

    // Get user ID from request (via params, body, etc.)
    const resourceUserId = getUserIdFromRequest(req);

    // Check if user owns the resource
    if (req.user.id !== resourceUserId) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: 'You can only access your own resources',
        errors: [{ field: 'authorization', message: 'Access denied' }]
      });
    }

    next();
  };
};

/**
 * Check if user is instructor of a specific course
 * Requires courseModel to verify ownership
 */
const isCourseInstructor = (getCourseId) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: ERROR_MESSAGES.UNAUTHORIZED
      });
    }

    // Admins can access any course
    if (req.user.role === ROLES.ADMIN) {
      return next();
    }

    // Only instructors can manage courses
    if (req.user.role !== ROLES.INSTRUCTOR) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: 'Only instructors can manage courses',
        errors: [{ field: 'authorization', message: 'Instructor role required' }]
      });
    }

    // Get course ID from request
    const courseId = getCourseId(req);
    if (!courseId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Course ID not provided'
      });
    }

    // Course ownership check would happen in the controller
    // Store the courseId for later verification
    req.courseId = courseId;
    next();
  };
};

module.exports = {
  authorize,
  isAdmin,
  isInstructorOrAdmin,
  isStudent,
  isOwnerOrAdmin,
  isCourseInstructor
};
