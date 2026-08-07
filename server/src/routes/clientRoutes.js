const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const { authenticateToken, requireRole } = require('../middlewares/authMiddleware');

router.use(authenticateToken, requireRole('admin', 'lawyer'));

router.get('/', clientController.getClients);
router.get('/:id', clientController.getClientById);
router.post('/', clientController.createClient);
router.put('/:id', clientController.updateClient);

module.exports = router;
