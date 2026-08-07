const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

router.get('/availability', appointmentController.getAvailability);
router.post('/', appointmentController.createAppointment);

module.exports = router;
