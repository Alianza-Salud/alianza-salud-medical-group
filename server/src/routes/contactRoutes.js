const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { authenticateToken, requireRole } = require('../middlewares/authMiddleware');

router.post('/', contactController.createContactMessage);

router.get('/', authenticateToken, requireRole('admin', 'auxiliar_admisiones', 'lawyer'), contactController.getMessages);
router.patch('/:id/read', authenticateToken, requireRole('admin', 'auxiliar_admisiones', 'lawyer'), contactController.markAsRead);

module.exports = router;
