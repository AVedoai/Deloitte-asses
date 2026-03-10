/**
 * Student Controller
 * Handles student profile and management operations
 */

const userModel = require('../models/userModel');
const enrollmentModel = require('../models/enrollmentModel');
const progressModel = require('../models/progressModel');
const {
  successResponse,
  paginatedResponse,
  notFoundResponse,
  forbiddenResponse
} = require('../utils/responseFormatter');
const { SUCCESS_MESSAGES, ROLES } = require('../config/constants');

/**
 * Get all students
 * @route GET /students
 * @access Private (Admin only)
 */
const getAllStudents = async (req, res, next) => {
  try {
    const { limit = 10, offset = 0 } = req.query;

    const filters = {
      role: ROLES.STUDENT,
      limit: parseInt(limit),
      offset: parseInt(offset)
    };

    const students = userModel.getAllUsers(filters);
    const totalStudents = userModel.getUsersByRole(ROLES.STUDENT).length;

    return paginatedResponse(
      res,
      'Students retrieved successfully',
      students,
      {
        total: totalStudents,
        limit: filters.limit,
        offset: filters.offset,
        hasMore: filters.offset + filters.limit < totalStudents
      }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get student profile
 * @route GET /students/:id
 * @access Private (Own data or Admin)
 */
const getStudentProfile = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check authorization
    if (req.user.role !== ROLES.ADMIN && req.user.id !== id) {
      return forbiddenResponse(res, 'You can only view your own profile');
    }

    const student = userModel.findById(id);
    if (!student || student.role !== ROLES.STUDENT) {
      return notFoundResponse(res, 'Student');
    }

    // Get enrollment and progress statistics
    const enrollments = enrollmentModel.getEnrollmentsByStudent(id);
    const totalProgress = progressModel.getProgressByStudent(id).length;

    const profile = {
      ...student,
      statistics: {
        totalEnrollments: enrollments.length,
        activeEnrollments: enrollments.filter(e => e.status === 'active').length,
        completedCourses: enrollments.filter(e => e.status === 'completed').length,
        totalLessonsCompleted: totalProgress
      }
    };

    return successResponse(res, 200, 'Student profile retrieved', profile);
  } catch (error) {
    next(error);
  }
};

/**
 * Update student profile
 * @route PUT /students/:id
 * @access Private (Own data or Admin)
 */
const updateStudentProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check authorization
    if (req.user.role !== ROLES.ADMIN && req.user.id !== id) {
      return forbiddenResponse(res, 'You can only update your own profile');
    }

    const student = userModel.findById(id);
    if (!student) {
      return notFoundResponse(res, 'Student');
    }

    // Only allow updating certain fields
    const allowedUpdates = {
      name: updates.name
    };

    const updatedStudent = userModel.updateUser(id, allowedUpdates);

    return successResponse(res, 200, SUCCESS_MESSAGES.UPDATED, updatedStudent);
  } catch (error) {
    next(error);
  }
};

/**
 * Get student's enrolled courses
 * @route GET /students/:id/courses
 * @access Private (Own data or Admin)
 */
const getStudentCourses = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check authorization
    if (req.user.role !== ROLES.ADMIN && req.user.id !== id) {
      return forbiddenResponse(res, 'You can only view your own courses');
    }

    const enrollments = enrollmentModel.getEnrollmentsByStudent(id);
    const courseModel = require('../models/courseModel');
    const lessonModel = require('../models/lessonModel');

    const courses = enrollments.map(enrollment => {
      const course = courseModel.getCourseById(enrollment.courseId);
      const totalLessons = lessonModel.getLessonCountByCourse(enrollment.courseId);
      const completedLessons = progressModel.getCompletedLessonCount(id, enrollment.courseId);
      const progress = progressModel.calculateCourseProgress(id, enrollment.courseId, totalLessons);

      return {
        enrollmentId: enrollment.id,
        enrolledAt: enrollment.enrolledAt,
        status: enrollment.status,
        course: course,
        progress: {
          completedLessons,
          totalLessons,
          percentage: progress
        }
      };
    });

    return successResponse(res, 200, 'Student courses retrieved', {
      studentId: id,
      courses,
      totalCourses: courses.length
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete student account
 * @route DELETE /students/:id
 * @access Private (Admin only)
 */
const deleteStudent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const student = userModel.findById(id);
    if (!student) {
      return notFoundResponse(res, 'Student');
    }

    // Delete associated data
    enrollmentModel.deleteEnrollmentsByStudent(id);
    progressModel.deleteProgressByStudent(id);
    userModel.deleteUser(id);

    return successResponse(res, 200, SUCCESS_MESSAGES.DELETED);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllStudents,
  getStudentProfile,
  updateStudentProfile,
  getStudentCourses,
  deleteStudent
};
