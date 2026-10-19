const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authenticateToken, requireRole } = require('../middlewares/authMiddleware');
const { publicFormRateLimit } = require('../middlewares/rateLimit');
const { validateAppointment, validatePositiveIntegerParams } = require('../middlewares/validateRequest');

// Rutas públicas
router.get('/availability', appointmentController.getAvailability);
router.post('/', publicFormRateLimit, validateAppointment, appointmentController.createAppointment);

// Rutas privadas para administración, auxiliares y expertos
router.get('/', authenticateToken, requireRole('admin', 'auxiliar_admisiones', 'lawyer'), appointmentController.getAppointments);
router.post('/admin', authenticateToken, requireRole('admin', 'auxiliar_admisiones'), appointmentController.createAdminAppointment);
router.patch('/:id/status', authenticateToken, requireRole('admin', 'auxiliar_admisiones', 'lawyer'), validatePositiveIntegerParams('id'), appointmentController.updateStatus);

module.exports = router;
