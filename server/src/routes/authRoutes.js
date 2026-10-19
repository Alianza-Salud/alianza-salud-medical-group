const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { authRateLimit, registerRateLimit } = require('../middlewares/rateLimit');
const { validateLogin, validateRegister } = require('../middlewares/validateRequest');

router.post('/register', registerRateLimit, validateRegister, authController.register);
router.post('/login', authRateLimit, validateLogin, authController.login);
router.post('/logout', authController.logout);
router.get('/me', authenticateToken, authController.getProfile);

module.exports = router;
