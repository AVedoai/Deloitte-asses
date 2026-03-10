/**
 * Progress Routes
 * Routes for student learning progress tracking
 */

const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const progressController = require('../controllers/progressController');
const { authenticate } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validator');

/**
 * @swagger
 * /progress:
 *   post:
 *     summary: Mark lesson as completed
 *     tags: [Progress]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *               - lessonId
 *             properties:
 *               courseId:
 *                 type: string
 *               lessonId:
 *                 type: string
 *               timeSpent:
 *                 type: number
 *                 description: Time spent in minutes
 *     responses:
 *       201:
 *         description: Progress updated successfully
 *       404:
 *         description: Lesson not found
 *       403:
 *         description: Must be enrolled in course
 */
router.post(
    '/',
    authenticate,
    [
        body('courseId').notEmpty().withMessage('Course ID is required'),
        body('lessonId').notEmpty().withMessage('Lesson ID is required'),
        body('timeSpent').optional().isNumeric().withMessage('Time spent must be a number')
    ],
    validate,
    progressController.markLessonComplete
);

/**
 * @swagger
 * /progress/student/{studentId}:
 *   get:
 *     summary: Get student's overall progress
 *     tags: [Progress]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student progress retrieved
 *       403:
 *         description: Forbidden
 */
router.get(
    '/student/:studentId',
    authenticate,
    progressController.getStudentProgress
);

/**
 * @swagger
 * /progress/course/{courseId}/student/{studentId}:
 *   get:
 *     summary: Get student progress for a specific course
 *     tags: [Progress]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course progress retrieved
 *       404:
 *         description: Enrollment not found
 */
router.get(
  '/course/:courseId/student/:studentId',
  authenticate,
  progressController.getCourseProgress
);

module.exports = router;
