const express = require('express');
const router = express.Router();

const serviceRoutes = require('./serviceRoutes');
const appointmentRoutes = require('./appointmentRoutes');
const contactRoutes = require('./contactRoutes');
const siteInfoRoutes = require('./siteInfoRoutes');

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Alianza Salud Medical Group API REST (Fase 2)',
    timestamp: new Date().toISOString(),
  });
});

// Rutas de módulos
router.use('/services', serviceRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/contact', contactRoutes);
router.use('/site-info', siteInfoRoutes);

module.exports = router;
