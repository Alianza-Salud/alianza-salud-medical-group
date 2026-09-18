const express = require('express');
const router = express.Router();
const caseReviewController = require('../controllers/caseReviewController');
const { authenticateToken, requireRole } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const { publicFormRateLimit } = require('../middlewares/rateLimit');
const { validateCaseReview, validatePositiveIntegerParams } = require('../middlewares/validateRequest');

const handleUploadIfMultipart = (req, res, next) => {
  const contentType = req.headers['content-type'] || '';
  if (contentType.includes('multipart/form-data')) {
    return upload.array('documents', 10)(req, res, next);
  }
  next();
};

// Ruta pública para que cualquier visitante / cliente envíe su solicitud de revisión
router.post('/', publicFormRateLimit, handleUploadIfMultipart, validateCaseReview, caseReviewController.createRequest);

// Rutas administrativas protegidas (Admin, Aux. Admisiones, Peritos / Abogados)
router.get('/', authenticateToken, requireRole('admin', 'auxiliar_admisiones', 'lawyer'), caseReviewController.getRequests);
router.get('/:id/documents/:docIndex/download', authenticateToken, requireRole('admin', 'auxiliar_admisiones', 'lawyer'), validatePositiveIntegerParams('id'), caseReviewController.downloadDocument);
router.patch('/:id/status', authenticateToken, requireRole('admin', 'auxiliar_admisiones', 'lawyer'), validatePositiveIntegerParams('id'), caseReviewController.updateRequestStatus);
router.post('/:id/convert', authenticateToken, requireRole('admin', 'auxiliar_admisiones', 'lawyer'), validatePositiveIntegerParams('id'), caseReviewController.convertToCase);

module.exports = router;
