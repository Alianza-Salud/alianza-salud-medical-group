const express = require('express');
const router = express.Router();
const lawyerController = require('../controllers/lawyerController');
const { authenticateToken, requireRole } = require('../middlewares/authMiddleware');

router.use(authenticateToken);

router.get('/', requireRole('admin', 'auxiliar_admisiones', 'lawyer'), lawyerController.getLawyers);
router.post('/', requireRole('admin'), lawyerController.createLawyer);
router.put('/:id', requireRole('admin'), lawyerController.updateLawyer);

module.exports = router;
