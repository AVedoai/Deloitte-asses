/**
 * Enrollment Controller
 * Handles student course enrollment operations
 */

const enrollmentModel = require('../models/enrollmentModel');
const courseModel = require('../models/courseModel');
const userModel = require('../models/userModel');
const lessonModel = require('../models/lessonModel');
const progressModel = require('../models/progressModel');
const {
  successResponse,
  createdResponse,
  notFoundResponse,
  forbiddenResponse,
  conflictResponse
} = require('../utils/responseFormatter');
const { SUCCESS_MESSAGES, ROLES } = require('../config/constants');

/**
 * Enroll student in a course
 * @route POST /enrollments
 * @access Private (Student)
 */
const enrollInCourse = async (req, res, next) => {
  try {
    const { courseId } = req.body;
    const studentId = req.user.id;

    // Check if course exists
    const course = courseModel.getCourseById(courseId);
    if (!course) {
      return notFoundResponse(res, 'Course');
    }

    // Check if already enrolled
    const existing = enrollmentModel.findEnrollment(studentId, courseId);
    if (existing) {
      return conflictResponse(res, 'Already enrolled in this course');
    }

    try {
      const enrollment = enrollmentModel.createEnrollment({ studentId, courseId });

      return createdResponse(res, SUCCESS_MESSAGES.ENROLLED, {
        enrollment,
        course: {
          id: course.id,
          title: course.title,
          instructor: course.instructor
        }
      });
    } catch (error) {
      if (error.message.includes('already enrolled')) {
        return conflictResponse(res, error.message);
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get all enrollments for a student
 * @route GET /enrollments/student/:studentId
 * @access Private (Own data or Admin)
 */
const getStudentEnrollments = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    // Check authorization (students can only view their own enrollments)
    if (req.user.role !== ROLES.ADMIN && req.user.id !== studentId) {
      return forbiddenResponse(res, 'You can only view your own enrollments');
    }

    const enrollments = enrollmentModel.getEnrollmentsByStudent(studentId);

    // Enrich enrollments with course details and progress
    const enrichedEnrollments = enrollments.map(enrollment => {
      const course = courseModel.getCourseById(enrollment.courseId);
      const lessonCount = lessonModel.getLessonCountByCourse(enrollment.courseId);
      const completedCount = progressModel.getCompletedLessonCount(studentId, enrollment.courseId);
      const progress = progressModel.calculateCourseProgress(studentId, enrollment.courseId, lessonCount);

      return {
        ...enrollment,
        course: course ? {
          id: course.id,
          title: course.title,
          instructor: course.instructor,
          category: course.category,
          level: course.level,
          thumbnail: course.thumbnail
        } : null,
        progress: {
          completedLessons: completedCount,
          totalLessons: lessonCount,
          percentage: progress
        }
      };
    });

    return successResponse(res, 200, 'Enrollments retrieved successfully', {
      enrollments: enrichedEnrollments,
      totalEnrollments: enrichedEnrollments.length
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all enrollments for a course
 * @route GET /enrollments/course/:courseId
 * @access Private (Course Instructor, Admin)
 */
const getCourseEnrollments = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    // Check if course exists
    const course = courseModel.getCourseById(courseId);
    if (!course) {
      return notFoundResponse(res, 'Course');
    }

    // Check authorization (instructors can only view their own course enrollments)
    if (req.user.role === ROLES.INSTRUCTOR && course.instructorId !== req.user.id) {
      return forbiddenResponse(res, 'You can only view enrollments for your own courses');
    }

    const enrollments = enrollmentModel.getEnrollmentsByCourse(courseId);

    // Enrich with student details
    const enrichedEnrollments = enrollments.map(enrollment => {
      const student = userModel.findById(enrollment.studentId);
      const lessonCount = lessonModel.getLessonCountByCourse(courseId);
      const completedCount = progressModel.getCompletedLessonCount(enrollment.studentId, courseId);
      const progress = progressModel.calculateCourseProgress(enrollment.studentId, courseId, lessonCount);

      return {
        ...enrollment,
        student: student ? {
          id: student.id,
          name: student.name,
          email: student.email
        } : null,
        progress: {
          completedLessons: completedCount,
          totalLessons: lessonCount,
          percentage: progress
        }
      };
    });

    return successResponse(res, 200, 'Course enrollments retrieved successfully', {
      course: {
        id: course.id,
        title: course.title
      },
      enrollments: enrichedEnrollments,
      totalEnrollments: enrichedEnrollments.length
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update enrollment status
 * @route PUT /enrollments/:id
 * @access Private (Student owns enrollment or Admin)
 */
const updateEnrollmentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const enrollment = enrollmentModel.getEnrollmentById(id);
    if (!enrollment) {
      return notFoundResponse(res, 'Enrollment');
    }

    // Check authorization
    if (req.user.role !== ROLES.ADMIN && req.user.id !== enrollment.studentId) {
      return forbiddenResponse(res, 'You can only update your own enrollments');
    }

    const updatedEnrollment = enrollmentModel.updateEnrollmentStatus(id, status);

    return successResponse(res, 200, 'Enrollment status updated', updatedEnrollment);
  } catch (error) {
    next(error);
  }
};

/**
 * Unenroll from course (delete enrollment)
 * @route DELETE /enrollments/:id
 * @access Private (Student owns enrollment or Admin)
 */
const unenrollFromCourse = async (req, res, next) => {
  try {
    const { id } = req.params;

    const enrollment = enrollmentModel.getEnrollmentById(id);
    if (!enrollment) {
      return notFoundResponse(res, 'Enrollment');
    }

    // Check authorization
    if (req.user.role !== ROLES.ADMIN && req.user.id !== enrollment.studentId) {
      return forbiddenResponse(res, 'You can only unenroll from your own courses');
    }

    enrollmentModel.deleteEnrollment(id);

    return successResponse(res, 200, 'Successfully unenrolled from course');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  enrollInCourse,
  getStudentEnrollments,
  getCourseEnrollments,
  updateEnrollmentStatus,
  unenrollFromCourse
};
