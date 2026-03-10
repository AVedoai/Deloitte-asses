/**
 * Course Controller
 * Handles course CRUD operations and management
 */

const courseModel = require('../models/courseModel');
const lessonModel = require('../models/lessonModel');
const enrollmentModel = require('../models/enrollmentModel');
const userModel = require('../models/userModel');
const {
  successResponse,
  createdResponse,
  paginatedResponse,
  notFoundResponse,
  forbiddenResponse,
  badRequestResponse
} = require('../utils/responseFormatter');
const { SUCCESS_MESSAGES, ROLES } = require('../config/constants');

/**
 * Get all courses with pagination and filtering
 * @route GET /courses
 * @access Public
 */
const getAllCourses = async (req, res, next) => {
  try {
    const {
      category,
      level,
      instructorId,
      search,
      limit = 10,
      offset = 0
    } = req.query;

    const filters = {
      category,
      level,
      instructorId,
      search,
      limit: parseInt(limit),
      offset: parseInt(offset)
    };

    const result = courseModel.getAllCourses(filters);

    return paginatedResponse(
      res,
      'Courses retrieved successfully',
      result.courses,
      {
        total: result.total,
        limit: result.limit,
        offset: result.offset,
        hasMore: result.hasMore
      }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get course by ID with lessons
 * @route GET /courses/:id
 * @access Public
 */
const getCourseById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = courseModel.getCourseById(id);
    if (!course) {
      return notFoundResponse(res, 'Course');
    }

    // Get lessons for this course
    const lessons = lessonModel.getLessonsByCourse(id);

    // Get enrollment count
    const enrollmentCount = enrollmentModel.getEnrollmentCountByCourse(id);

    return successResponse(res, 200, 'Course retrieved successfully', {
      ...course,
      lessons,
      enrollmentCount,
      lessonCount: lessons.length
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new course
 * @route POST /courses
 * @access Private (Instructor, Admin)
 */
const createCourse = async (req, res, next) => {
  try {
    const { title, description, category, level, duration, thumbnail } = req.body;

    // Get instructor info
    const instructor = userModel.findById(req.user.id);
    if (!instructor) {
      return notFoundResponse(res, 'Instructor');
    }

    const courseData = {
      title,
      description,
      instructor: instructor.name,
      instructorId: req.user.id,
      category,
      level,
      duration,
      thumbnail: thumbnail || ''
    };

    const course = courseModel.createCourse(courseData);

    return createdResponse(res, SUCCESS_MESSAGES.CREATED, course);
  } catch (error) {
    next(error);
  }
};

/**
 * Update course
 * @route PUT /courses/:id
 * @access Private (Course Instructor, Admin)
 */
const updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const course = courseModel.getCourseById(id);
    if (!course) {
      return notFoundResponse(res, 'Course');
    }

    // Check if user is the course instructor or admin
    if (req.user.role !== ROLES.ADMIN && course.instructorId !== req.user.id) {
      return forbiddenResponse(res, 'You can only update your own courses');
    }

    const updatedCourse = courseModel.updateCourse(id, updates);

    return successResponse(res, 200, SUCCESS_MESSAGES.UPDATED, updatedCourse);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete course
 * @route DELETE /courses/:id
 * @access Private (Admin only)
 */
const deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = courseModel.getCourseById(id);
    if (!course) {
      return notFoundResponse(res, 'Course');
    }

    // Delete associated lessons
    lessonModel.deleteLessonsByCourse(id);

    // Delete associated enrollments
    enrollmentModel.deleteEnrollmentsByCourse(id);

    // Delete course
    courseModel.deleteCourse(id);

    return successResponse(res, 200, SUCCESS_MESSAGES.DELETED);
  } catch (error) {
    next(error);
  }
};

/**
 * Get course statistics
 * @route GET /courses/:id/stats
 * @access Public
 */
const getCourseStats = async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = courseModel.getCourseById(id);
    if (!course) {
      return notFoundResponse(res, 'Course');
    }

    const lessonCount = lessonModel.getLessonCountByCourse(id);
    const enrollmentCount = enrollmentModel.getEnrollmentCountByCourse(id);
    const activeEnrollments = enrollmentModel.getActiveEnrollmentCountByCourse(id);
    const completedEnrollments = enrollmentModel.getCompletedEnrollmentCountByCourse(id);
    const totalDuration = lessonModel.getTotalCourseDuration(id);

    const stats = {
      courseId: id,
      title: course.title,
      instructor: course.instructor,
      totalLessons: lessonCount,
      totalDuration: totalDuration,
      totalEnrollments: enrollmentCount,
      activeEnrollments,
      completedEnrollments,
      completionRate: enrollmentCount > 0 
        ? Math.round((completedEnrollments / enrollmentCount) * 100) 
        : 0
    };

    return successResponse(res, 200, 'Course statistics retrieved', stats);
  } catch (error) {
    next(error);
  }
};

/**
 * Get courses by instructor
 * @route GET /courses/instructor/:instructorId
 * @access Public
 */
const getCoursesByInstructor = async (req, res, next) => {
  try {
    const { instructorId } = req.params;

    const instructor = userModel.findById(instructorId);
    if (!instructor || instructor.role !== ROLES.INSTRUCTOR) {
      return notFoundResponse(res, 'Instructor');
    }

    const courses = courseModel.getCoursesByInstructor(instructorId);

    return successResponse(res, 200, 'Instructor courses retrieved', {
      instructor: instructor.name,
      courses,
      totalCourses: courses.length
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseStats,
  getCoursesByInstructor
};
