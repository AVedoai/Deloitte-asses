/**
 * Course Routes
 * Routes for course management operations
 */

const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const courseController = require('../controllers/courseController');
const { authenticate } = require('../middleware/authMiddleware');
const { isInstructorOrAdmin, isAdmin } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validator');

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Get all courses with pagination and filtering
 *     tags: [Courses]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *           enum: [beginner, intermediate, advanced]
 *       - in: query
 *         name: instructorId
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in title and description
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: Courses retrieved successfully
 */
router.get('/', courseController.getAllCourses);

/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     summary: Get course by ID with lessons
 *     tags: [Courses]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course retrieved successfully
 *       404:
 *         description: Course not found
 */
router.get('/:id', courseController.getCourseById);

/**
 * @swagger
 * /courses:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - category
 *               - duration
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               level:
 *                 type: string
 *                 enum: [beginner, intermediate, advanced]
 *                 default: beginner
 *               duration:
 *                 type: number
 *                 description: Duration in hours
 *               thumbnail:
 *                 type: string
 *     responses:
 *       201:
 *         description: Course created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Instructor or Admin role required
 */
router.post(
  '/',
  authenticate,
  isInstructorOrAdmin,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('level').optional().isIn(['beginner', 'intermediate', 'advanced']).withMessage('Invalid level'),
    body('duration').isNumeric().withMessage('Duration must be a number'),
    body('thumbnail').optional().isURL().withMessage('Thumbnail must be a valid URL')
  ],
  validate,
  courseController.createCourse
);

/**
 * @swagger
 * /courses/{id}:
 *   put:
 *     summary: Update course
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Course updated successfully
 *       404:
 *         description: Course not found
 *       403:
 *         description: Forbidden
 */
router.put(
  '/:id',
  authenticate,
  isInstructorOrAdmin,
  courseController.updateCourse
);

/**
 * @swagger
 * /courses/{id}:
 *   delete:
 *     summary: Delete course (Admin only)
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *       404:
 *         description: Course not found
 */
router.delete(
  '/:id',
  authenticate,
  isAdmin,
  courseController.deleteCourse
);

/**
 * @swagger
 * /courses/{id}/stats:
 *   get:
 *     summary: Get course statistics
 *     tags: [Courses]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course statistics retrieved
 *       404:
 *         description: Course not found
 */
router.get('/:id/stats', courseController.getCourseStats);

module.exports = router;
