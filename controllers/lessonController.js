/**
 * Lesson Controller
 * Handles lesson CRUD operations within courses
 */

const lessonModel = require('../models/lessonModel');
const courseModel = require('../models/courseModel');
const {
  successResponse,
  createdResponse,
  notFoundResponse,
  forbiddenResponse
} = require('../utils/responseFormatter');
const { SUCCESS_MESSAGES, ROLES } = require('../config/constants');

/**
 * Add lesson to course
 * @route POST /courses/:courseId/lessons
 * @access Private (Course Instructor, Admin)
 */
const addLesson = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { title, description, content, duration, videoUrl, order } = req.body;

    // Check if course exists
    const course = courseModel.getCourseById(courseId);
    if (!course) {
      return notFoundResponse(res, 'Course');
    }

    // Check if user is the course instructor or admin
    if (req.user.role !== ROLES.ADMIN && course.instructorId !== req.user.id) {
      return forbiddenResponse(res, 'You can only add lessons to your own courses');
    }

    const lessonData = {
      courseId,
      title,
      description,
      content,
      duration,
      videoUrl: videoUrl || '',
      order
    };

    const lesson = lessonModel.createLesson(lessonData);

    return createdResponse(res, 'Lesson added successfully', lesson);
  } catch (error) {
    next(error);
  }
};

/**
 * Get all lessons for a course
 * @route GET /courses/:courseId/lessons
 * @access Public
 */
const getLessonsByCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    // Check if course exists
    const course = courseModel.getCourseById(courseId);
    if (!course) {
      return notFoundResponse(res, 'Course');
    }

    const lessons = lessonModel.getLessonsByCourse(courseId);
    const totalDuration = lessonModel.getTotalCourseDuration(courseId);

    return successResponse(res, 200, 'Lessons retrieved successfully', {
      courseId,
      courseTitle: course.title,
      lessons,
      totalLessons: lessons.length,
      totalDuration
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single lesson by ID
 * @route GET /lessons/:id
 * @access Public
 */
const getLessonById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const lesson = lessonModel.getLessonById(id);
    if (!lesson) {
      return notFoundResponse(res, 'Lesson');
    }

    // Get course info
    const course = courseModel.getCourseById(lesson.courseId);

    return successResponse(res, 200, 'Lesson retrieved successfully', {
      ...lesson,
      courseName: course ? course.title : 'Unknown'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update lesson
 * @route PUT /lessons/:id
 * @access Private (Course Instructor, Admin)
 */
const updateLesson = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const lesson = lessonModel.getLessonById(id);
    if (!lesson) {
      return notFoundResponse(res, 'Lesson');
    }

    // Get course to check ownership
    const course = courseModel.getCourseById(lesson.courseId);
    if (!course) {
      return notFoundResponse(res, 'Course');
    }

    // Check if user is the course instructor or admin
    if (req.user.role !== ROLES.ADMIN && course.instructorId !== req.user.id) {
      return forbiddenResponse(res, 'You can only update lessons in your own courses');
    }

    const updatedLesson = lessonModel.updateLesson(id, updates);

    return successResponse(res, 200, SUCCESS_MESSAGES.UPDATED, updatedLesson);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete lesson
 * @route DELETE /lessons/:id
 * @access Private (Course Instructor, Admin)
 */
const deleteLesson = async (req, res, next) => {
  try {
    const { id } = req.params;

    const lesson = lessonModel.getLessonById(id);
    if (!lesson) {
      return notFoundResponse(res, 'Lesson');
    }

    // Get course to check ownership
    const course = courseModel.getCourseById(lesson.courseId);
    if (!course) {
      return notFoundResponse(res, 'Course');
    }

    // Check if user is the course instructor or admin
    if (req.user.role !== ROLES.ADMIN && course.instructorId !== req.user.id) {
      return forbiddenResponse(res, 'You can only delete lessons from your own courses');
    }

    lessonModel.deleteLesson(id);

    return successResponse(res, 200, SUCCESS_MESSAGES.DELETED);
  } catch (error) {
    next(error);
  }
};

/**
 * Reorder lessons in a course
 * @route PUT /courses/:courseId/lessons/reorder
 * @access Private (Course Instructor, Admin)
 */
const reorderLessons = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { lessonIds } = req.body; // Array of lesson IDs in desired order

    // Check if course exists
    const course = courseModel.getCourseById(courseId);
    if (!course) {
      return notFoundResponse(res, 'Course');
    }

    // Check if user is the course instructor or admin
    if (req.user.role !== ROLES.ADMIN && course.instructorId !== req.user.id) {
      return forbiddenResponse(res, 'You can only reorder lessons in your own courses');
    }

    const success = lessonModel.reorderLessons(courseId, lessonIds);
    if (!success) {
      return badRequestResponse(res, 'Invalid lesson IDs provided');
    }

    const lessons = lessonModel.getLessonsByCourse(courseId);

    return successResponse(res, 200, 'Lessons reordered successfully', lessons);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addLesson,
  getLessonsByCourse,
  getLessonById,
  updateLesson,
  deleteLesson,
  reorderLessons
};
