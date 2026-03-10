/**
 * Progress Model
 * Manages student learning progress with in-memory storage
 */

// In-memory data store
let progressRecords = [];

/**
 * Generate unique progress ID
 */
const generateId = () => {
  return `prg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Create a new progress record (mark lesson as completed)
 * @param {Object} progressData - Progress data
 * @returns {Object} Created progress record
 */
const createProgress = (progressData) => {
  const { studentId, courseId, lessonId, timeSpent = 0 } = progressData;

  // Check if lesson already completed
  const existing = progressRecords.find(
    p => p.studentId === studentId && p.lessonId === lessonId
  );

  if (existing) {
    // Update existing record
    existing.completedAt = new Date().toISOString();
    existing.timeSpent = timeSpent;
    return existing;
  }

  const progress = {
    id: generateId(),
    studentId,
    courseId,
    lessonId,
    completedAt: new Date().toISOString(),
    timeSpent
  };

  progressRecords.push(progress);
  return progress;
};

/**
 * Get all progress records for a student
 * @param {string} studentId - Student user ID
 * @returns {Array} Array of progress records
 */
const getProgressByStudent = (studentId) => {
  return progressRecords.filter(p => p.studentId === studentId);
};

/**
 * Get progress records for a specific course and student
 * @param {string} studentId - Student user ID
 * @param {string} courseId - Course ID
 * @returns {Array} Array of progress records
 */
const getProgressByStudentAndCourse = (studentId, courseId) => {
  return progressRecords.filter(
    p => p.studentId === studentId && p.courseId === courseId
  );
};

/**
 * Get progress for a specific lesson and student
 * @param {string} studentId - Student user ID
 * @param {string} lessonId - Lesson ID
 * @returns {Object|null} Progress record or null
 */
const getProgressByLesson = (studentId, lessonId) => {
  return progressRecords.find(
    p => p.studentId === studentId && p.lessonId === lessonId
  ) || null;
};

/**
 * Check if a lesson is completed by student
 * @param {string} studentId - Student user ID
 * @param {string} lessonId - Lesson ID
 * @returns {boolean} Completion status
 */
const isLessonCompleted = (studentId, lessonId) => {
  return progressRecords.some(
    p => p.studentId === studentId && p.lessonId === lessonId
  );
};

/**
 * Calculate course completion percentage for a student
 * @param {string} studentId - Student user ID
 * @param {string} courseId - Course ID
 * @param {number} totalLessons - Total number of lessons in the course
 * @returns {number} Completion percentage (0-100)
 */
const calculateCourseProgress = (studentId, courseId, totalLessons) => {
  if (totalLessons === 0) return 0;

  const completedLessons = progressRecords.filter(
    p => p.studentId === studentId && p.courseId === courseId
  ).length;

  return Math.round((completedLessons / totalLessons) * 100);
};

/**
 * Get completed lesson count for a course and student
 * @param {string} studentId - Student user ID
 * @param {string} courseId - Course ID
 * @returns {number} Number of completed lessons
 */
const getCompletedLessonCount = (studentId, courseId) => {
  return progressRecords.filter(
    p => p.studentId === studentId && p.courseId === courseId
  ).length;
};

/**
 * Get total time spent on a course by student
 * @param {string} studentId - Student user ID
 * @param {string} courseId - Course ID
 * @returns {number} Total time in minutes
 */
const getTotalTimeSpent = (studentId, courseId) => {
  return progressRecords
    .filter(p => p.studentId === studentId && p.courseId === courseId)
    .reduce((total, p) => total + p.timeSpent, 0);
};

/**
 * Update progress record
 * @param {string} id - Progress ID
 * @param {Object} updates - Fields to update
 * @returns {Object|null} Updated progress record or null
 */
const updateProgress = (id, updates) => {
  const progressIndex = progressRecords.findIndex(p => p.id === id);
  if (progressIndex === -1) return null;

  // Don't allow updating id, studentId, courseId, lessonId
  const { id: _, studentId, courseId, lessonId, ...allowedUpdates } = updates;

  progressRecords[progressIndex] = {
    ...progressRecords[progressIndex],
    ...allowedUpdates
  };

  return progressRecords[progressIndex];
};

/**
 * Delete progress record
 * @param {string} id - Progress ID
 * @returns {boolean} Success status
 */
const deleteProgress = (id) => {
  const initialLength = progressRecords.length;
  progressRecords = progressRecords.filter(p => p.id !== id);
  return progressRecords.length < initialLength;
};

/**
 * Delete all progress records for a student
 * @param {string} studentId - Student user ID
 * @returns {number} Number of records deleted
 */
const deleteProgressByStudent = (studentId) => {
  const initialLength = progressRecords.length;
  progressRecords = progressRecords.filter(p => p.studentId !== studentId);
  return initialLength - progressRecords.length;
};

/**
 * Delete all progress records for a course
 * @param {string} courseId - Course ID
 * @returns {number} Number of records deleted
 */
const deleteProgressByCourse = (courseId) => {
  const initialLength = progressRecords.length;
  progressRecords = progressRecords.filter(p => p.courseId !== courseId);
  return initialLength - progressRecords.length;
};

/**
 * Delete all progress records for a lesson
 * @param {string} lessonId - Lesson ID
 * @returns {number} Number of records deleted
 */
const deleteProgressByLesson = (lessonId) => {
  const initialLength = progressRecords.length;
  progressRecords = progressRecords.filter(p => p.lessonId !== lessonId);
  return initialLength - progressRecords.length;
};

/**
 * Get average course progress across all students
 * @param {string} courseId - Course ID
 * @param {number} totalLessons - Total lessons in course
 * @param {number} enrolledCount - Number of enrolled students
 * @returns {number} Average completion percentage
 */
const getAverageCourseProgress = (courseId, totalLessons, enrolledCount) => {
  if (enrolledCount === 0 || totalLessons === 0) return 0;

  const courseProgress = progressRecords.filter(p => p.courseId === courseId);
  const totalProgress = courseProgress.length;
  const maxPossibleProgress = enrolledCount * totalLessons;

  return Math.round((totalProgress / maxPossibleProgress) * 100);
};

/**
 * Get total progress record count
 * @returns {number} Total number of progress records
 */
const getTotalProgressCount = () => progressRecords.length;

/**
 * Clear all progress records (for testing)
 */
const clearAllProgress = () => {
  progressRecords = [];
};

/**
 * Seed progress records (for development/testing)
 */
const seedProgress = (seedData) => {
  progressRecords = seedData;
};

module.exports = {
  createProgress,
  getProgressByStudent,
  getProgressByStudentAndCourse,
  getProgressByLesson,
  isLessonCompleted,
  calculateCourseProgress,
  getCompletedLessonCount,
  getTotalTimeSpent,
  updateProgress,
  deleteProgress,
  deleteProgressByStudent,
  deleteProgressByCourse,
  deleteProgressByLesson,
  getAverageCourseProgress,
  getTotalProgressCount,
  clearAllProgress,
  seedProgress
};
