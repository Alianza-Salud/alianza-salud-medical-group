const express = require('express');
const router = express.Router();
const caseController = require('../controllers/caseController');
const { authenticateToken, requireRole } = require('../middlewares/authMiddleware');

router.use(authenticateToken);

router.get('/', caseController.getCases);
router.get('/:id', caseController.getCaseById);

router.post('/', requireRole('admin', 'lawyer'), caseController.createCase);
router.patch('/:id/stage', requireRole('admin', 'lawyer'), caseController.updateCaseStage);
router.post('/:id/updates', requireRole('admin', 'lawyer'), caseController.addCaseUpdate);

module.exports = router;
