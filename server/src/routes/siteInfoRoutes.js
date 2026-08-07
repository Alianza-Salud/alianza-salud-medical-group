const express = require('express');
const router = express.Router();
const siteInfoController = require('../controllers/siteInfoController');
const { authenticateToken, requireRole } = require('../middlewares/authMiddleware');

router.get('/', siteInfoController.getSiteInfo);
router.put('/', authenticateToken, requireRole('admin'), siteInfoController.updateSiteInfo);

module.exports = router;
