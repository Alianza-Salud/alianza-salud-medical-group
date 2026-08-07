const express = require('express');
const router = express.Router();
const lawyerController = require('../controllers/lawyerController');
const { authenticateToken, requireRole } = require('../middlewares/authMiddleware');

router.use(authenticateToken, requireRole('admin'));

router.get('/', lawyerController.getLawyers);
router.post('/', lawyerController.createLawyer);
router.put('/:id', lawyerController.updateLawyer);

module.exports = router;
