/**
 * Lesson Routes
 * Routes for lesson management within courses
 */

const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const lessonController = require('../controllers/lessonController');
const { authenticate } = require('../middleware/authMiddleware');
const { isInstructorOrAdmin } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validator');

/**
 * @swagger
 * /courses/{courseId}/lessons:
 *   post:
 *     summary: Add lesson to course
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - content
 *               - duration
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               content:
 *                 type: string
 *               duration:
 *                 type: number
 *                 description: Duration in minutes
 *               videoUrl:
 *                 type: string
 *               order:
 *                 type: number
 *     responses:
 *       201:
 *         description: Lesson added successfully
 *       404:
 *         description: Course not found
 *       403:
 *         description: Forbidden
 */
router.post(
  '/:courseId/lessons',
  authenticate,
  isInstructorOrAdmin,
  [
    param('courseId').notEmpty().withMessage('Course ID is required'),
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('content').trim().notEmpty().withMessage('Content is required'),
    body('duration').isNumeric().withMessage('Duration must be a number'),
    body('videoUrl').optional().isURL().withMessage('Video URL must be valid'),
    body('order').optional().isNumeric().withMessage('Order must be a number')
  ],
  validate,
  lessonController.addLesson
);

/**
 * @swagger
 * /courses/{courseId}/lessons:
 *   get:
 *     summary: Get all lessons for a course
 *     tags: [Lessons]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lessons retrieved successfully
 *       404:
 *         description: Course not found
 */
router.get('/:courseId/lessons', lessonController.getLessonsByCourse);

/**
 * @swagger
 * /lessons/{id}:
 *   get:
 *     summary: Get single lesson by ID
 *     tags: [Lessons]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lesson retrieved successfully
 *       404:
 *         description: Lesson not found
 */
router.get('/lessons/:id', lessonController.getLessonById);

/**
 * @swagger
 * /lessons/{id}:
 *   put:
 *     summary: Update lesson
 *     tags: [Lessons]
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
 *         description: Lesson updated successfully
 *       404:
 *         description: Lesson not found
 *       403:
 *         description: Forbidden
 */
router.put(
  '/lessons/:id',
  authenticate,
  isInstructorOrAdmin,
  lessonController.updateLesson
);

/**
 * @swagger
 * /lessons/{id}:
 *   delete:
 *     summary: Delete lesson
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lesson deleted successfully
 *       404:
 *         description: Lesson not found
 */
router.delete(
  '/lessons/:id',
  authenticate,
  isInstructorOrAdmin,
  lessonController.deleteLesson
);

module.exports = router;
