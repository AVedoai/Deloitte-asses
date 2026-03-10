/**
 * Lesson Model
 * Manages lesson data within courses with in-memory storage
 */

// In-memory data store
let lessons = [];

/**
 * Generate unique lesson ID
 */
const generateId = () => {
  return `lsn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Create a new lesson
 * @param {Object} lessonData - Lesson data
 * @returns {Object} Created lesson
 */
const createLesson = (lessonData) => {
  const {
    courseId,
    title,
    description,
    content,
    duration,
    videoUrl = '',
    order
  } = lessonData;

  // If order not provided, set it to the next sequential number
  const courseLessons = lessons.filter(l => l.courseId === courseId);
  const lessonOrder = order !== undefined ? order : courseLessons.length + 1;

  const lesson = {
    id: generateId(),
    courseId,
    title,
    description,
    content,
    duration,
    videoUrl,
    order: lessonOrder,
    createdAt: new Date().toISOString()
  };

  lessons.push(lesson);
  return lesson;
};

/**
 * Get all lessons for a course
 * @param {string} courseId - Course ID
 * @returns {Array} Array of lessons sorted by order
 */
const getLessonsByCourse = (courseId) => {
  return lessons
    .filter(l => l.courseId === courseId)
    .sort((a, b) => a.order - b.order);
};

/**
 * Get lesson by ID
 * @param {string} id - Lesson ID
 * @returns {Object|null} Lesson object or null
 */
const getLessonById = (id) => {
  return lessons.find(l => l.id === id) || null;
};

/**
 * Update lesson
 * @param {string} id - Lesson ID
 * @param {Object} updates - Fields to update
 * @returns {Object|null} Updated lesson or null
 */
const updateLesson = (id, updates) => {
  const lessonIndex = lessons.findIndex(l => l.id === id);
  if (lessonIndex === -1) return null;

  // Don't allow updating id, courseId, or createdAt
  const { id: _, courseId, createdAt, ...allowedUpdates } = updates;

  lessons[lessonIndex] = {
    ...lessons[lessonIndex],
    ...allowedUpdates,
    updatedAt: new Date().toISOString()
  };

  return lessons[lessonIndex];
};

/**
 * Delete lesson
 * @param {string} id - Lesson ID
 * @returns {boolean} Success status
 */
const deleteLesson = (id) => {
  const lesson = getLessonById(id);
  if (!lesson) return false;

  const initialLength = lessons.length;
  lessons = lessons.filter(l => l.id !== id);

  // Reorder remaining lessons in the same course
  const courseLessons = lessons
    .filter(l => l.courseId === lesson.courseId)
    .sort((a, b) => a.order - b.order);

  courseLessons.forEach((l, index) => {
    l.order = index + 1;
  });

  return lessons.length < initialLength;
};

/**
 * Delete all lessons for a course
 * @param {string} courseId - Course ID
 * @returns {number} Number of lessons deleted
 */
const deleteLessonsByCourse = (courseId) => {
  const initialLength = lessons.length;
  lessons = lessons.filter(l => l.courseId !== courseId);
  return initialLength - lessons.length;
};

/**
 * Get lesson count for a course
 * @param {string} courseId - Course ID
 * @returns {number} Number of lessons
 */
const getLessonCountByCourse = (courseId) => {
  return lessons.filter(l => l.courseId === courseId).length;
};

/**
 * Get total duration of all lessons in a course
 * @param {string} courseId - Course ID
 * @returns {number} Total duration in minutes
 */
const getTotalCourseDuration = (courseId) => {
  return lessons
    .filter(l => l.courseId === courseId)
    .reduce((total, lesson) => total + lesson.duration, 0);
};

/**
 * Reorder lessons
 * @param {string} courseId - Course ID
 * @param {Array} lessonIds - Array of lesson IDs in desired order
 * @returns {boolean} Success status
 */
const reorderLessons = (courseId, lessonIds) => {
  const courseLessons = lessons.filter(l => l.courseId === courseId);
  
  // Verify all lesson IDs belong to this course
  const allValid = lessonIds.every(id => 
    courseLessons.some(l => l.id === id)
  );

  if (!allValid) return false;

  // Update order for each lesson
  lessonIds.forEach((id, index) => {
    const lesson = lessons.find(l => l.id === id);
    if (lesson) {
      lesson.order = index + 1;
    }
  });

  return true;
};

/**
 * Check if lesson exists
 * @param {string} id - Lesson ID
 * @returns {boolean} Existence status
 */
const lessonExists = (id) => {
  return lessons.some(l => l.id === id);
};

/**
 * Get total lesson count
 * @returns {number} Total number of lessons
 */
const getTotalLessonCount = () => lessons.length;

/**
 * Clear all lessons (for testing)
 */
const clearAllLessons = () => {
  lessons = [];
};

/**
 * Seed lessons (for development/testing)
 */
const seedLessons = (seedData) => {
  lessons = seedData;
};

module.exports = {
  createLesson,
  getLessonsByCourse,
  getLessonById,
  updateLesson,
  deleteLesson,
  deleteLessonsByCourse,
  getLessonCountByCourse,
  getTotalCourseDuration,
  reorderLessons,
  lessonExists,
  getTotalLessonCount,
  clearAllLessons,
  seedLessons
};
