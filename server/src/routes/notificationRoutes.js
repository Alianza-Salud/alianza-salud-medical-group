const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticateToken, requireRole } = require('../middlewares/authMiddleware');

// Proteger todas las rutas de notificaciones para Administración y Auxiliares
router.use(authenticateToken, requireRole('admin', 'auxiliar_admisiones'));

router.get('/settings', notificationController.getSettings);
router.put('/settings', notificationController.updateSettings);
router.get('/logs', notificationController.getLogs);
router.post('/logs/:id/retry', notificationController.retryLog);

module.exports = router;
