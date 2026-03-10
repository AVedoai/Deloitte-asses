/**
 * Student Routes
 * Routes for student profile management
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const studentController = require('../controllers/studentController');
const { authenticate } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validator');

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Get all students (Admin only)
 *     tags: [Students]
 *     parameters:
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
 *         description: Students retrieved successfully
 *       403:
 *         description: Admin access required
 */
router.get(
  '/',
  authenticate,
  isAdmin,
  studentController.getAllStudents
);

/**
 * @swagger
 * /students/{id}:
 *   get:
 *     summary: Get student profile
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student profile retrieved
 *       404:
 *         description: Student not found
 */
router.get(
  '/:id',
  authenticate,
  studentController.getStudentProfile
);

/**
 * @swagger
 * /students/{id}:
 *   put:
 *     summary: Update student profile
 *     tags: [Students]
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
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       403:
 *         description: Forbidden
 */
router.put(
  '/:id',
  authenticate,
  [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty')
  ],
  validate,
  studentController.updateStudentProfile
);

/**
 * @swagger
 * /students/{id}/courses:
 *   get:
 *     summary: Get student's enrolled courses
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student courses retrieved
 *       403:
 *         description: Forbidden
 */
router.get(
  '/:id/courses',
  authenticate,
  studentController.getStudentCourses
);

/**
 * @swagger
 * /students/{id}:
 *   delete:
 *     summary: Delete student account (Admin only)
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student deleted successfully
 *       404:
 *         description: Student not found
 */
router.delete(
  '/:id',
  authenticate,
  isAdmin,
  studentController.deleteStudent
);

module.exports = router;
