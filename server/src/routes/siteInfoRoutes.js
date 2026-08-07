const express = require('express');
const router = express.Router();
const siteInfoController = require('../controllers/siteInfoController');

router.get('/', siteInfoController.getSiteInfo);

module.exports = router;
