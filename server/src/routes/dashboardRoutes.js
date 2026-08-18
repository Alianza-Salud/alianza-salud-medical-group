const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticateToken, requireRole } = require('../middlewares/authMiddleware');

router.get('/stats', authenticateToken, requireRole('admin', 'auxiliar_admisiones', 'lawyer'), dashboardController.getDashboardStats);

module.exports = router;
