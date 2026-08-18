const express = require('express');
const router = express.Router();
const caseReviewController = require('../controllers/caseReviewController');
const { authenticateToken, requireRole } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const handleUploadIfMultipart = (req, res, next) => {
  const contentType = req.headers['content-type'] || '';
  if (contentType.includes('multipart/form-data')) {
    return upload.any()(req, res, next);
  }
  next();
};

// Ruta pública para que cualquier visitante / cliente envíe su solicitud de revisión
router.post('/', handleUploadIfMultipart, caseReviewController.createRequest);

// Rutas administrativas protegidas (Admin, Aux. Admisiones, Peritos / Abogados)
router.get('/', authenticateToken, requireRole('admin', 'auxiliar_admisiones', 'lawyer'), caseReviewController.getRequests);
router.get('/:id/documents/:docIndex/download', authenticateToken, requireRole('admin', 'auxiliar_admisiones', 'lawyer'), caseReviewController.downloadDocument);
router.patch('/:id/status', authenticateToken, requireRole('admin', 'auxiliar_admisiones', 'lawyer'), caseReviewController.updateRequestStatus);
router.post('/:id/convert', authenticateToken, requireRole('admin', 'auxiliar_admisiones', 'lawyer'), caseReviewController.convertToCase);

module.exports = router;
