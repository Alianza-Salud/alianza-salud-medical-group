const express = require('express');
const router = express.Router();
const siteInfoController = require('../controllers/siteInfoController');
const { authenticateToken, requireRole } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.get('/', siteInfoController.getSiteInfo);
router.put('/', authenticateToken, requireRole('admin'), siteInfoController.updateSiteInfo);
router.post('/upload-visual-resource', authenticateToken, requireRole('admin'), upload.image('image'), siteInfoController.uploadVisualResource);

module.exports = router;
