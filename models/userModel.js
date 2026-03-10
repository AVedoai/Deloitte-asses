/**
 * User Model
 * Manages user data (students, instructors, admins) with in-memory storage
 * Includes password hashing with bcrypt
 */

const bcrypt = require('bcryptjs');

// In-memory data store
let users = [];

/**
 * Generate unique user ID
 */
const generateId = () => {
  return `usr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Hash password using bcrypt
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

/**
 * Compare password with hashed password
 * @param {string} plainPassword - Plain text password
 * @param {string} hashedPassword - Hashed password
 * @returns {Promise<boolean>} Match result
 */
const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

/**
 * Create a new user
 * @param {Object} userData - User data (name, email, password, role)
 * @returns {Promise<Object>} Created user (without password)
 */
const createUser = async (userData) => {
  const { name, email, password, role = 'student' } = userData;
  
  // Check if email already exists
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    throw new Error('Email already registered');
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  const user = {
    id: generateId(),
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    role,
    createdAt: new Date().toISOString()
  };

  users.push(user);

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

/**
 * Find user by email
 * @param {string} email - User email
 * @returns {Object|null} User object or null
 */
const findByEmail = (email) => {
  return users.find(u => u.email === email.toLowerCase()) || null;
};

/**
 * Find user by ID
 * @param {string} id - User ID
 * @returns {Object|null} User object (without password) or null
 */
const findById = (id) => {
  const user = users.find(u => u.id === id);
  if (!user) return null;

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

/**
 * Get all users (admin only)
 * @param {Object} filters - Filter options (role, limit, offset)
 * @returns {Array} Array of users (without passwords)
 */
const getAllUsers = (filters = {}) => {
  const { role, limit = 10, offset = 0 } = filters;
  
  let filteredUsers = [...users];

  // Filter by role if specified
  if (role) {
    filteredUsers = filteredUsers.filter(u => u.role === role);
  }

  // Apply pagination
  const paginatedUsers = filteredUsers.slice(offset, offset + limit);

  // Remove passwords
  return paginatedUsers.map(({ password, ...user }) => user);
};

/**
 * Update user profile
 * @param {string} id - User ID
 * @param {Object} updates - Fields to update
 * @returns {Object|null} Updated user or null
 */
const updateUser = (id, updates) => {
  const userIndex = users.findIndex(u => u.id === id);
  if (userIndex === -1) return null;

  // Don't allow updating password, email, or role through this method
  const { password, email, role, ...allowedUpdates } = updates;

  users[userIndex] = {
    ...users[userIndex],
    ...allowedUpdates,
    updatedAt: new Date().toISOString()
  };

  const { password: _, ...userWithoutPassword } = users[userIndex];
  return userWithoutPassword;
};

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean} Success status
 */
const deleteUser = (id) => {
  const initialLength = users.length;
  users = users.filter(u => u.id !== id);
  return users.length < initialLength;
};

/**
 * Get users by role
 * @param {string} role - User role
 * @returns {Array} Array of users with specified role
 */
const getUsersByRole = (role) => {
  return users
    .filter(u => u.role === role)
    .map(({ password, ...user }) => user);
};

/**
 * Authenticate user (for login)
 * @param {string} email - User email
 * @param {string} password - Plain text password
 * @returns {Object|null} User object (without password) or null
 */
const authenticate = async (email, password) => {
  const user = findByEmail(email);
  if (!user) return null;

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) return null;

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

/**
 * Get total user count
 * @returns {number} Total number of users
 */
const getUserCount = () => users.length;

/**
 * Clear all users (for testing)
 */
const clearAllUsers = () => {
  users = [];
};

/**
 * Seed initial users (for development/testing)
 */
const seedUsers = (seedData) => {
  users = seedData;
};

module.exports = {
  createUser,
  findByEmail,
  findById,
  getAllUsers,
  updateUser,
  deleteUser,
  getUsersByRole,
  authenticate,
  getUserCount,
  clearAllUsers,
  seedUsers,
  hashPassword,
  comparePassword
};
