/**
 * Course Model
 * Manages course data with in-memory storage
 */

// In-memory data store
let courses = [];

/**
 * Generate unique course ID
 */
const generateId = () => {
  return `crs_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Create a new course
 * @param {Object} courseData - Course data
 * @returns {Object} Created course
 */
const createCourse = (courseData) => {
  const {
    title,
    description,
    instructor,
    instructorId,
    category,
    level = 'beginner',
    duration,
    thumbnail = ''
  } = courseData;

  const course = {
    id: generateId(),
    title,
    description,
    instructor,
    instructorId,
    category,
    level,
    duration,
    thumbnail,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  courses.push(course);
  return course;
};

/**
 * Get all courses
 * @param {Object} filters - Filter options (category, level, instructorId, limit, offset)
 * @returns {Object} Courses array and metadata
 */
const getAllCourses = (filters = {}) => {
  const { category, level, instructorId, search, limit = 10, offset = 0 } = filters;
  
  let filteredCourses = [...courses];

  // Apply filters
  if (category) {
    filteredCourses = filteredCourses.filter(c => c.category === category);
  }
  if (level) {
    filteredCourses = filteredCourses.filter(c => c.level === level);
  }
  if (instructorId) {
    filteredCourses = filteredCourses.filter(c => c.instructorId === instructorId);
  }
  if (search) {
    const searchLower = search.toLowerCase();
    filteredCourses = filteredCourses.filter(c => 
      c.title.toLowerCase().includes(searchLower) ||
      c.description.toLowerCase().includes(searchLower)
    );
  }

  const total = filteredCourses.length;
  const paginatedCourses = filteredCourses.slice(offset, offset + limit);

  return {
    courses: paginatedCourses,
    total,
    limit,
    offset,
    hasMore: offset + limit < total
  };
};

/**
 * Get course by ID
 * @param {string} id - Course ID
 * @returns {Object|null} Course object or null
 */
const getCourseById = (id) => {
  return courses.find(c => c.id === id) || null;
};

/**
 * Update course
 * @param {string} id - Course ID
 * @param {Object} updates - Fields to update
 * @returns {Object|null} Updated course or null
 */
const updateCourse = (id, updates) => {
  const courseIndex = courses.findIndex(c => c.id === id);
  if (courseIndex === -1) return null;

  // Don't allow updating id or createdAt
  const { id: _, createdAt, ...allowedUpdates } = updates;

  courses[courseIndex] = {
    ...courses[courseIndex],
    ...allowedUpdates,
    updatedAt: new Date().toISOString()
  };

  return courses[courseIndex];
};

/**
 * Delete course
 * @param {string} id - Course ID
 * @returns {boolean} Success status
 */
const deleteCourse = (id) => {
  const initialLength = courses.length;
  courses = courses.filter(c => c.id !== id);
  return courses.length < initialLength;
};

/**
 * Get courses by instructor
 * @param {string} instructorId - Instructor user ID
 * @returns {Array} Array of courses
 */
const getCoursesByInstructor = (instructorId) => {
  return courses.filter(c => c.instructorId === instructorId);
};

/**
 * Get total course count
 * @returns {number} Total number of courses
 */
const getCourseCount = () => courses.length;

/**
 * Check if course exists
 * @param {string} id - Course ID
 * @returns {boolean} Existence status
 */
const courseExists = (id) => {
  return courses.some(c => c.id === id);
};

/**
 * Clear all courses (for testing)
 */
const clearAllCourses = () => {
  courses = [];
};

/**
 * Seed courses (for development/testing)
 */
const seedCourses = (seedData) => {
  courses = seedData;
};

/**
 * Get course statistics
 * @param {string} courseId - Course ID
 * @returns {Object} Course statistics
 */
const getCourseStats = (courseId) => {
  const course = getCourseById(courseId);
  if (!course) return null;

  // These stats will be populated by enrollment and progress models
  return {
    courseId,
    title: course.title,
    totalLessons: 0, // Will be calculated from lesson model
    enrolledStudents: 0, // Will be calculated from enrollment model
    completedStudents: 0, // Will be calculated from enrollment model
    averageProgress: 0 // Will be calculated from progress model
  };
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getCoursesByInstructor,
  getCourseCount,
  courseExists,
  clearAllCourses,
  seedCourses,
  getCourseStats
};
