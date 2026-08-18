const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authenticateToken, requireRole } = require('../middlewares/authMiddleware');

// Rutas públicas
router.get('/availability', appointmentController.getAvailability);
router.post('/', appointmentController.createAppointment);

// Rutas privadas para administración, auxiliares y expertos
router.get('/', authenticateToken, requireRole('admin', 'auxiliar_admisiones', 'lawyer'), appointmentController.getAppointments);
router.patch('/:id/status', authenticateToken, requireRole('admin', 'auxiliar_admisiones', 'lawyer'), appointmentController.updateStatus);

module.exports = router;
