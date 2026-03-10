/**
 * Dashboard Routes
 * Routes for analytics and dashboard data
 */

const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticate } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');

/**
 * @swagger
 * /dashboard/admin:
 *   get:
 *     summary: Get admin dashboard statistics
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Admin dashboard retrieved
 *       403:
 *         description: Admin access required
 */
router.get(
    '/admin',
    authenticate,
    isAdmin,
    dashboardController.getAdminDashboard
);

/**
 * @swagger
 * /dashboard/student/{id}:
 *   get:
 *     summary: Get student dashboard
 *     tags: [Dashboard]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student dashboard retrieved
 *       403:
 *         description: Forbidden
 */
router.get(
    '/student/:id',
    authenticate,
    dashboardController.getStudentDashboard
);

/**
 * @swagger
 * /dashboard/instructor/{id}:
 *   get:
 *     summary: Get instructor dashboard
 *     tags: [Dashboard]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Instructor dashboard retrieved
 *       403:
 *         description: Forbidden
 */
router.get(
    '/instructor/:id',
    authenticate,
    dashboardController.getInstructorDashboard
);

module.exports = router;
