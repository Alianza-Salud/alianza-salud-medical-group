const express = require('express');
const router = express.Router();
const caseController = require('../controllers/caseController');
const { authenticateToken, requireRole } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.use(authenticateToken);

router.get('/', caseController.getCases);
router.get('/:id', caseController.getCaseById);

router.post('/', requireRole('admin', 'auxiliar_admisiones', 'lawyer'), caseController.createCase);
router.patch('/:id/stage', requireRole('admin', 'auxiliar_admisiones', 'lawyer'), caseController.updateCaseStage);
router.post('/:id/updates', requireRole('admin', 'auxiliar_admisiones', 'lawyer'), caseController.addCaseUpdate);

router.get('/:id/documents', caseController.getCaseDocuments);
router.get('/:id/documents/:docId/download', caseController.downloadCaseDocument);
router.post('/:id/documents', requireRole('admin', 'auxiliar_admisiones', 'lawyer'), upload.any(), caseController.addCaseDocument);
router.patch('/documents/:docId/visibility', requireRole('admin', 'auxiliar_admisiones', 'lawyer'), caseController.updateDocumentVisibility);
router.put('/:id/lawyers', requireRole('admin', 'auxiliar_admisiones', 'lawyer'), caseController.updateCaseLawyers);

module.exports = router;
