const express = require('express');
const router = express.Router();
const caseTypeController = require('../controllers/caseTypeController');
const { authenticateToken, requireRole } = require('../middlewares/authMiddleware');

router.use(authenticateToken);

router.get('/', caseTypeController.getCaseTypes);
router.post('/', requireRole('admin'), caseTypeController.createCaseType);
router.put('/:id', requireRole('admin'), caseTypeController.updateCaseType);
router.delete('/:id', requireRole('admin'), caseTypeController.deleteCaseType);

module.exports = router;
