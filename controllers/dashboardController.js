/**
 * Dashboard Controller
 * Provides analytics and dashboard data for different user roles
 */

const userModel = require('../models/userModel');
const courseModel = require('../models/courseModel');
const lessonModel = require('../models/lessonModel');
const enrollmentModel = require('../models/enrollmentModel');
const progressModel = require('../models/progressModel');
const {
  successResponse,
  forbiddenResponse
} = require('../utils/responseFormatter');
const { ROLES } = require('../config/constants');

/**
 * Get admin dashboard statistics
 * @route GET /dashboard/admin
 * @access Private (Admin only)
 */
const getAdminDashboard = async (req, res, next) => {
  try {
    // Get counts
    const totalUsers = userModel.getUserCount();
    const totalCourses = courseModel.getCourseCount();
    const totalLessons = lessonModel.getTotalLessonCount();
    const totalEnrollments = enrollmentModel.getTotalEnrollmentCount();
    const totalProgress = progressModel.getTotalProgressCount();

    // Get users by role
    const students = userModel.getUsersByRole(ROLES.STUDENT);
    const instructors = userModel.getUsersByRole(ROLES.INSTRUCTOR);
    const admins = userModel.getUsersByRole(ROLES.ADMIN);

    // Get enrollment statistics
    const activeEnrollments = enrollmentModel.getEnrollmentsByStatus('active').length;
    const completedEnrollments = enrollmentModel.getEnrollmentsByStatus('completed').length;
    const droppedEnrollments = enrollmentModel.getEnrollmentsByStatus('dropped').length;

    // Get top courses by enrollment
    const allCourses = courseModel.getAllCourses({ limit: 100 }).courses;
    const coursesWithEnrollments = allCourses.map(course => ({
      ...course,
      enrollmentCount: enrollmentModel.getEnrollmentCountByCourse(course.id)
    })).sort((a, b) => b.enrollmentCount - a.enrollmentCount).slice(0, 5);

    // Get recent enrollments
    const recentEnrollments = enrollmentModel.getEnrollmentsByStatus('active')
      .slice(0, 10)
      .map(enrollment => {
        const student = userModel.findById(enrollment.studentId);
        const course = courseModel.getCourseById(enrollment.courseId);
        return {
          ...enrollment,
          studentName: student ? student.name : 'Unknown',
          courseName: course ? course.title : 'Unknown'
        };
      });

    const dashboard = {
      overview: {
        totalUsers,
        totalCourses,
        totalLessons,
        totalEnrollments,
        totalProgress
      },
      users: {
        totalStudents: students.length,
        totalInstructors: instructors.length,
        totalAdmins: admins.length
      },
      enrollments: {
        active: activeEnrollments,
        completed: completedEnrollments,
        dropped: droppedEnrollments,
        completionRate: totalEnrollments > 0 
          ? Math.round((completedEnrollments / totalEnrollments) * 100) 
          : 0
      },
      topCourses: coursesWithEnrollments,
      recentEnrollments
    };

    return successResponse(res, 200, 'Admin dashboard retrieved', dashboard);
  } catch (error) {
    next(error);
  }
};

/**
 * Get student dashboard
 * @route GET /dashboard/student/:id
 * @access Private (Own data or Admin)
 */
const getStudentDashboard = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check authorization
    if (req.user.role !== ROLES.ADMIN && req.user.id !== id) {
      return forbiddenResponse(res, 'You can only view your own dashboard');
    }

    const student = userModel.findById(id);
    if (!student) {
      return notFoundResponse(res, 'Student');
    }

    // Get enrollments
    const enrollments = enrollmentModel.getEnrollmentsByStudent(id);
    const activeEnrollments = enrollments.filter(e => e.status === 'active');
    const completedEnrollments = enrollments.filter(e => e.status === 'completed');

    // Get progress for each enrollment
    const coursesWithProgress = enrollments.map(enrollment => {
      const course = courseModel.getCourseById(enrollment.courseId);
      const totalLessons = lessonModel.getLessonCountByCourse(enrollment.courseId);
      const completedLessons = progressModel.getCompletedLessonCount(id, enrollment.courseId);
      const percentage = progressModel.calculateCourseProgress(id, enrollment.courseId, totalLessons);
      const timeSpent = progressModel.getTotalTimeSpent(id, enrollment.courseId);

      return {
        courseId: course.id,
        courseName: course.title,
        instructor: course.instructor,
        category: course.category,
        level: course.level,
        thumbnail: course.thumbnail,
        enrolledAt: enrollment.enrolledAt,
        status: enrollment.status,
        progress: {
          totalLessons,
          completedLessons,
          percentage,
          timeSpent
        }
      };
    });

    // Sort by progress (in-progress courses first, then by percentage)
    const inProgressCourses = coursesWithProgress
      .filter(c => c.status === 'active' && c.progress.percentage > 0 && c.progress.percentage < 100)
      .sort((a, b) => b.progress.percentage - a.progress.percentage);

    const notStartedCourses = coursesWithProgress
      .filter(c => c.status === 'active' && c.progress.percentage === 0);

    const totalLessonsCompleted = progressModel.getProgressByStudent(id).length;
    const totalTimeSpent = enrollments.reduce((total, e) => 
      total + progressModel.getTotalTimeSpent(id, e.courseId), 0
    );

    const dashboard = {
      student: {
        id: student.id,
        name: student.name,
        email: student.email
      },
      overview: {
        totalEnrolledCourses: enrollments.length,
        activeEnrollments: activeEnrollments.length,
        completedCourses: completedEnrollments.length,
        totalLessonsCompleted,
        totalTimeSpent
      },
      inProgressCourses,
      notStartedCourses,
      completedCourses: coursesWithProgress.filter(c => c.status === 'completed')
    };

    return successResponse(res, 200, 'Student dashboard retrieved', dashboard);
  } catch (error) {
    next(error);
  }
};

/**
 * Get instructor dashboard
 * @route GET /dashboard/instructor/:id
 * @access Private (Own data or Admin)
 */
const getInstructorDashboard = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check authorization
    if (req.user.role !== ROLES.ADMIN && req.user.id !== id) {
      return forbiddenResponse(res, 'You can only view your own dashboard');
    }

    const instructor = userModel.findById(id);
    if (!instructor || instructor.role !== ROLES.INSTRUCTOR) {
      return notFoundResponse(res, 'Instructor');
    }

    // Get instructor's courses
    const courses = courseModel.getCoursesByInstructor(id);

    // Get statistics for each course
    const coursesWithStats = courses.map(course => {
      const totalLessons = lessonModel.getLessonCountByCourse(course.id);
      const totalEnrollments = enrollmentModel.getEnrollmentCountByCourse(course.id);
      const activeEnrollments = enrollmentModel.getActiveEnrollmentCountByCourse(course.id);
      const completedEnrollments = enrollmentModel.getCompletedEnrollmentCountByCourse(course.id);

      return {
        ...course,
        stats: {
          totalLessons,
          totalEnrollments,
          activeEnrollments,
          completedEnrollments,
          completionRate: totalEnrollments > 0 
            ? Math.round((completedEnrollments / totalEnrollments) * 100) 
            : 0
        }
      };
    });

    // Calculate totals
    const totalCourses = courses.length;
    const totalLessons = courses.reduce((sum, course) => 
      sum + lessonModel.getLessonCountByCourse(course.id), 0
    );
    const totalStudents = courses.reduce((sum, course) => 
      sum + enrollmentModel.getEnrollmentCountByCourse(course.id), 0
    );
    const totalActiveStudents = courses.reduce((sum, course) => 
      sum + enrollmentModel.getActiveEnrollmentCountByCourse(course.id), 0
    );

    // Get recent enrollments in instructor's courses
    const recentEnrollments = courses.flatMap(course => {
      const enrollments = enrollmentModel.getEnrollmentsByCourse(course.id);
      return enrollments.map(e => {
        const student = userModel.findById(e.studentId);
        return {
          ...e,
          courseName: course.title,
          studentName: student ? student.name : 'Unknown'
        };
      });
    }).sort((a, b) => new Date(b.enrolledAt) - new Date(a.enrolledAt)).slice(0, 10);

    const dashboard = {
      instructor: {
        id: instructor.id,
        name: instructor.name,
        email: instructor.email
      },
      overview: {
        totalCourses,
        totalLessons,
        totalStudents,
        totalActiveStudents
      },
      courses: coursesWithStats,
      recentEnrollments
    };

    return successResponse(res, 200, 'Instructor dashboard retrieved', dashboard);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminDashboard,
  getStudentDashboard,
  getInstructorDashboard
};
