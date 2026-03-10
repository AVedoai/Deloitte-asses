/**
 * Enrollment Model
 * Manages student course enrollments with in-memory storage
 */

// In-memory data store
let enrollments = [];

/**
 * Generate unique enrollment ID
 */
const generateId = () => {
  return `enr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Create a new enrollment
 * @param {Object} enrollmentData - Enrollment data
 * @returns {Object} Created enrollment
 */
const createEnrollment = (enrollmentData) => {
  const { studentId, courseId } = enrollmentData;

  // Check if already enrolled
  const existing = enrollments.find(
    e => e.studentId === studentId && e.courseId === courseId
  );

  if (existing) {
    throw new Error('Student already enrolled in this course');
  }

  const enrollment = {
    id: generateId(),
    studentId,
    courseId,
    enrolledAt: new Date().toISOString(),
    status: 'active'
  };

  enrollments.push(enrollment);
  return enrollment;
};

/**
 * Get all enrollments for a student
 * @param {string} studentId - Student user ID
 * @returns {Array} Array of enrollments
 */
const getEnrollmentsByStudent = (studentId) => {
  return enrollments.filter(e => e.studentId === studentId);
};

/**
 * Get all enrollments for a course
 * @param {string} courseId - Course ID
 * @returns {Array} Array of enrollments
 */
const getEnrollmentsByCourse = (courseId) => {
  return enrollments.filter(e => e.courseId === courseId);
};

/**
 * Get enrollment by ID
 * @param {string} id - Enrollment ID
 * @returns {Object|null} Enrollment object or null
 */
const getEnrollmentById = (id) => {
  return enrollments.find(e => e.id === id) || null;
};

/**
 * Check if student is enrolled in a course
 * @param {string} studentId - Student user ID
 * @param {string} courseId - Course ID
 * @returns {Object|null} Enrollment object or null
 */
const findEnrollment = (studentId, courseId) => {
  return enrollments.find(
    e => e.studentId === studentId && e.courseId === courseId
  ) || null;
};

/**
 * Update enrollment status
 * @param {string} id - Enrollment ID
 * @param {string} status - New status (active, completed, dropped)
 * @returns {Object|null} Updated enrollment or null
 */
const updateEnrollmentStatus = (id, status) => {
  const enrollmentIndex = enrollments.findIndex(e => e.id === id);
  if (enrollmentIndex === -1) return null;

  enrollments[enrollmentIndex].status = status;
  enrollments[enrollmentIndex].updatedAt = new Date().toISOString();

  if (status === 'completed') {
    enrollments[enrollmentIndex].completedAt = new Date().toISOString();
  }

  return enrollments[enrollmentIndex];
};

/**
 * Delete enrollment (unenroll student)
 * @param {string} id - Enrollment ID
 * @returns {boolean} Success status
 */
const deleteEnrollment = (id) => {
  const initialLength = enrollments.length;
  enrollments = enrollments.filter(e => e.id !== id);
  return enrollments.length < initialLength;
};

/**
 * Delete all enrollments for a student
 * @param {string} studentId - Student user ID
 * @returns {number} Number of enrollments deleted
 */
const deleteEnrollmentsByStudent = (studentId) => {
  const initialLength = enrollments.length;
  enrollments = enrollments.filter(e => e.studentId !== studentId);
  return initialLength - enrollments.length;
};

/**
 * Delete all enrollments for a course
 * @param {string} courseId - Course ID
 * @returns {number} Number of enrollments deleted
 */
const deleteEnrollmentsByCourse = (courseId) => {
  const initialLength = enrollments.length;
  enrollments = enrollments.filter(e => e.courseId !== courseId);
  return initialLength - enrollments.length;
};

/**
 * Get enrollment count for a course
 * @param {string} courseId - Course ID
 * @returns {number} Number of enrolled students
 */
const getEnrollmentCountByCourse = (courseId) => {
  return enrollments.filter(e => e.courseId === courseId).length;
};

/**
 * Get active enrollment count for a course
 * @param {string} courseId - Course ID
 * @returns {number} Number of actively enrolled students
 */
const getActiveEnrollmentCountByCourse = (courseId) => {
  return enrollments.filter(
    e => e.courseId === courseId && e.status === 'active'
  ).length;
};

/**
 * Get completed enrollment count for a course
 * @param {string} courseId - Course ID
 * @returns {number} Number of students who completed the course
 */
const getCompletedEnrollmentCountByCourse = (courseId) => {
  return enrollments.filter(
    e => e.courseId === courseId && e.status === 'completed'
  ).length;
};

/**
 * Get total enrollment count
 * @returns {number} Total number of enrollments
 */
const getTotalEnrollmentCount = () => enrollments.length;

/**
 * Get enrollments by status
 * @param {string} status - Enrollment status
 * @returns {Array} Array of enrollments
 */
const getEnrollmentsByStatus = (status) => {
  return enrollments.filter(e => e.status === status);
};

/**
 * Clear all enrollments (for testing)
 */
const clearAllEnrollments = () => {
  enrollments = [];
};

/**
 * Seed enrollments (for development/testing)
 */
const seedEnrollments = (seedData) => {
  enrollments = seedData;
};

module.exports = {
  createEnrollment,
  getEnrollmentsByStudent,
  getEnrollmentsByCourse,
  getEnrollmentById,
  findEnrollment,
  updateEnrollmentStatus,
  deleteEnrollment,
  deleteEnrollmentsByStudent,
  deleteEnrollmentsByCourse,
  getEnrollmentCountByCourse,
  getActiveEnrollmentCountByCourse,
  getCompletedEnrollmentCountByCourse,
  getTotalEnrollmentCount,
  getEnrollmentsByStatus,
  clearAllEnrollments,
  seedEnrollments
};
