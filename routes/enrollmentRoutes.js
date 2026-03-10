/**
 * Enrollment Routes
 * Routes for student course enrollment operations
 */

const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const enrollmentController = require('../controllers/enrollmentController');
const { authenticate } = require('../middleware/authMiddleware');
const { isAdmin, isInstructorOrAdmin } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validator');

/**
 * @swagger
 * /enrollments:
 *   post:
 *     summary: Enroll student in a course
 *     tags: [Enrollments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *             properties:
 *               courseId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Successfully enrolled
 *       404:
 *         description: Course not found
 *       409:
 *         description: Already enrolled
 */
router.post(
    '/',
    authenticate,
    [
        body('courseId').notEmpty().withMessage('Course ID is required')
    ],
    validate,
    enrollmentController.enrollInCourse
);

/**
 * @swagger
 * /enrollments/student/{studentId}:
 *   get:
 *     summary: Get all enrollments for a student
 *     tags: [Enrollments]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Enrollments retrieved successfully
 *       403:
 *         description: Forbidden
 */
router.get(
    '/student/:studentId',
    authenticate,
    enrollmentController.getStudentEnrollments
);

/**
 * @swagger
 * /enrollments/course/{courseId}:
 *   get:
 *     summary: Get all enrollments for a course
 *     tags: [Enrollments]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course enrollments retrieved
 *       403:
 *         description: Forbidden
 */
router.get(
    '/course/:courseId',
    authenticate,
    isInstructorOrAdmin,
    enrollmentController.getCourseEnrollments
);

/**
 * @swagger
 * /enrollments/{id}:
 *   put:
 *     summary: Update enrollment status
 *     tags: [Enrollments]
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
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, completed, dropped]
 *     responses:
 *       200:
 *         description: Enrollment status updated
 *       404:
 *         description: Enrollment not found
 */
router.put(
    '/:id',
    authenticate,
    [
        body('status').isIn(['active', 'completed', 'dropped']).withMessage('Invalid status')
    ],
    validate,
    enrollmentController.updateEnrollmentStatus
);

/**
 * @swagger
 * /enrollments/{id}:
 *   delete:
 *     summary: Unenroll from course
 *     tags: [Enrollments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully unenrolled
 *       404:
 *         description: Enrollment not found
 */
router.delete(
    '/:id',
    authenticate,
    enrollmentController.unenrollFromCourse
);

module.exports = router;
