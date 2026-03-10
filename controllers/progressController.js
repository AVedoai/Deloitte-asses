/**
 * Progress Controller
 * Handles student learning progress tracking
 */

const progressModel = require('../models/progressModel');
const enrollmentModel = require('../models/enrollmentModel');
const lessonModel = require('../models/lessonModel');
const courseModel = require('../models/courseModel');
const {
  successResponse,
  createdResponse,
  notFoundResponse,
  forbiddenResponse,
  badRequestResponse
} = require('../utils/responseFormatter');
const { SUCCESS_MESSAGES, ROLES } = require('../config/constants');

/**
 * Mark lesson as completed
 * @route POST /progress
 * @access Private (Student)
 */
const markLessonComplete = async (req, res, next) => {
  try {
    const { courseId, lessonId, timeSpent } = req.body;
    const studentId = req.user.id;

    // Check if lesson exists
    const lesson = lessonModel.getLessonById(lessonId);
    if (!lesson) {
      return notFoundResponse(res, 'Lesson');
    }

    // Check if student is enrolled in the course
    const enrollment = enrollmentModel.findEnrollment(studentId, courseId);
    if (!enrollment) {
      return forbiddenResponse(res, 'You must be enrolled in this course');
    }

    // Check if lesson belongs to the course
    if (lesson.courseId !== courseId) {
      return badRequestResponse(res, 'Lesson does not belong to this course');
    }

    const progressData = {
      studentId,
      courseId,
      lessonId,
      timeSpent: timeSpent || lesson.duration
    };

    const progress = progressModel.createProgress(progressData);

    // Calculate updated course progress
    const totalLessons = lessonModel.getLessonCountByCourse(courseId);
    const completedLessons = progressModel.getCompletedLessonCount(studentId, courseId);
    const progressPercentage = progressModel.calculateCourseProgress(studentId, courseId, totalLessons);

    // Update enrollment status to completed if all lessons are done
    if (completedLessons === totalLessons) {
      enrollmentModel.updateEnrollmentStatus(enrollment.id, 'completed');
    }

    return createdResponse(res, SUCCESS_MESSAGES.PROGRESS_UPDATED, {
      progress,
      courseProgress: {
        completedLessons,
        totalLessons,
        percentage: progressPercentage,
        isCompleted: completedLessons === totalLessons
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get student's overall progress
 * @route GET /progress/student/:studentId
 * @access Private (Own data or Admin)
 */
const getStudentProgress = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    // Check authorization
    if (req.user.role !== ROLES.ADMIN && req.user.id !== studentId) {
      return forbiddenResponse(res, 'You can only view your own progress');
    }

    const allProgress = progressModel.getProgressByStudent(studentId);
    const enrollments = enrollmentModel.getEnrollmentsByStudent(studentId);

    // Group progress by course
    const progressByCourse = enrollments.map(enrollment => {
      const course = courseModel.getCourseById(enrollment.courseId);
      const totalLessons = lessonModel.getLessonCountByCourse(enrollment.courseId);
      const completedLessons = progressModel.getCompletedLessonCount(studentId, enrollment.courseId);
      const percentage = progressModel.calculateCourseProgress(studentId, enrollment.courseId, totalLessons);
      const timeSpent = progressModel.getTotalTimeSpent(studentId, enrollment.courseId);

      return {
        courseId: enrollment.courseId,
        courseName: course ? course.title : 'Unknown',
        enrolledAt: enrollment.enrolledAt,
        status: enrollment.status,
        totalLessons,
        completedLessons,
        percentage,
        timeSpent,
        isCompleted: completedLessons === totalLessons
      };
    });

    return successResponse(res, 200, 'Student progress retrieved successfully', {
      studentId,
      totalCourses: enrollments.length,
      coursesCompleted: progressByCourse.filter(p => p.isCompleted).length,
      coursesInProgress: progressByCourse.filter(p => !p.isCompleted && p.completedLessons > 0).length,
      totalLessonsCompleted: allProgress.length,
      progressByCourse
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get student progress for a specific course
 * @route GET /progress/course/:courseId/student/:studentId
 * @access Private (Own data or Admin or Course Instructor)
 */
const getCourseProgress = async (req, res, next) => {
  try {
    const { courseId, studentId } = req.params;

    // Get course
    const course = courseModel.getCourseById(courseId);
    if (!course) {
      return notFoundResponse(res, 'Course');
    }

    // Check authorization
    const isOwner = req.user.id === studentId;
    const isInstructor = req.user.role === ROLES.INSTRUCTOR && course.instructorId === req.user.id;
    const isAdmin = req.user.role === ROLES.ADMIN;

    if (!isOwner && !isInstructor && !isAdmin) {
      return forbiddenResponse(res, 'Access denied');
    }

    // Check enrollment
    const enrollment = enrollmentModel.findEnrollment(studentId, courseId);
    if (!enrollment) {
      return notFoundResponse(res, 'Enrollment');
    }

    // Get all lessons and progress
    const lessons = lessonModel.getLessonsByCourse(courseId);
    const progressRecords = progressModel.getProgressByStudentAndCourse(studentId, courseId);

    // Enrich lessons with completion status
    const lessonsWithProgress = lessons.map(lesson => {
      const completed = progressRecords.find(p => p.lessonId === lesson.id);
      return {
        ...lesson,
        isCompleted: !!completed,
        completedAt: completed ? completed.completedAt : null,
        timeSpent: completed ? completed.timeSpent : 0
      };
    });

    const totalLessons = lessons.length;
    const completedLessons = progressRecords.length;
    const percentage = progressModel.calculateCourseProgress(studentId, courseId, totalLessons);
    const totalTimeSpent = progressModel.getTotalTimeSpent(studentId, courseId);

    return successResponse(res, 200, 'Course progress retrieved successfully', {
      course: {
        id: course.id,
        title: course.title,
        instructor: course.instructor
      },
      enrollment,
      progress: {
        totalLessons,
        completedLessons,
        percentage,
        totalTimeSpent,
        isCompleted: completedLessons === totalLessons
      },
      lessons: lessonsWithProgress
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update progress record
 * @route PUT /progress/:id
 * @access Private (Own data or Admin)
 */
const updateProgress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const progress = progressModel.getProgressByLesson(req.user.id, id);
    if (!progress) {
      return notFoundResponse(res, 'Progress record');
    }

    // Only allow updating timeSpent
    const allowedUpdates = { timeSpent: updates.timeSpent };
    const updated = progressModel.updateProgress(progress.id, allowedUpdates);

    return successResponse(res, 200, SUCCESS_MESSAGES.UPDATED, updated);
  } catch (error) {
    next(error);
  }
};

/**
 * Get lesson completion status
 * @route GET /progress/lesson/:lessonId/student/:studentId
 * @access Private
 */
const getLessonProgress = async (req, res, next) => {
  try {
    const { lessonId, studentId } = req.params;

    // Check authorization
    if (req.user.role !== ROLES.ADMIN && req.user.id !== studentId) {
      return forbiddenResponse(res, 'You can only view your own progress');
    }

    const lesson = lessonModel.getLessonById(lessonId);
    if (!lesson) {
      return notFoundResponse(res, 'Lesson');
    }

    const progress = progressModel.getProgressByLesson(studentId, lessonId);

    return successResponse(res, 200, 'Lesson progress retrieved', {
      lesson: {
        id: lesson.id,
        title: lesson.title,
        duration: lesson.duration
      },
      isCompleted: !!progress,
      completedAt: progress ? progress.completedAt : null,
      timeSpent: progress ? progress.timeSpent : 0
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  markLessonComplete,
  getStudentProgress,
  getCourseProgress,
  updateProgress,
  getLessonProgress
};
