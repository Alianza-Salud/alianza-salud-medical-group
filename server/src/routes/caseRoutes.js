const express = require('express');
const router = express.Router();
const caseController = require('../controllers/caseController');
const { authenticateToken, requireRole } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const { requireCaseRead, requireCaseModify } = require('../middlewares/caseAuthorization');
const { validatePositiveIntegerParams } = require('../middlewares/validateRequest');

router.use(authenticateToken);

router.get('/', caseController.getCases);
router.get('/:id', validatePositiveIntegerParams('id'), requireCaseRead, caseController.getCaseById);

router.post('/', requireRole('admin', 'auxiliar_admisiones', 'lawyer'), caseController.createCase);
router.patch('/:id/stage', requireRole('admin', 'auxiliar_admisiones', 'lawyer'), validatePositiveIntegerParams('id'), requireCaseModify, caseController.updateCaseStage);
router.post('/:id/updates', requireRole('admin', 'auxiliar_admisiones', 'lawyer'), validatePositiveIntegerParams('id'), requireCaseModify, caseController.addCaseUpdate);

router.get('/:id/documents', validatePositiveIntegerParams('id'), requireCaseRead, caseController.getCaseDocuments);
router.get('/:id/documents/:docId/download', validatePositiveIntegerParams('id', 'docId'), requireCaseRead, caseController.downloadCaseDocument);
router.post('/:id/documents', requireRole('admin', 'auxiliar_admisiones', 'lawyer'), validatePositiveIntegerParams('id'), requireCaseModify, upload.fields([{ name: 'files', maxCount: 10 }, { name: 'file', maxCount: 1 }]), caseController.addCaseDocument);
router.patch('/documents/:docId/visibility', requireRole('admin', 'auxiliar_admisiones', 'lawyer'), validatePositiveIntegerParams('docId'), caseController.updateDocumentVisibility);
router.put('/:id/lawyers', requireRole('admin', 'auxiliar_admisiones'), validatePositiveIntegerParams('id'), requireCaseModify, caseController.updateCaseLawyers);

module.exports = router;
