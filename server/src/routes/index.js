const express = require('express');
const router = express.Router();

const serviceRoutes = require('./serviceRoutes');
const appointmentRoutes = require('./appointmentRoutes');
const contactRoutes = require('./contactRoutes');
const siteInfoRoutes = require('./siteInfoRoutes');
const authRoutes = require('./authRoutes');
const caseRoutes = require('./caseRoutes');
const clientRoutes = require('./clientRoutes');
const lawyerRoutes = require('./lawyerRoutes');
const userRoutes = require('./userRoutes');
const dashboardRoutes = require('./dashboardRoutes');

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Alianza Salud Medical Group API REST (Maestros & Control de Etapas)',
    timestamp: new Date().toISOString(),
  });
});

// Rutas de módulos
router.use('/services', serviceRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/contact', contactRoutes);
router.use('/site-info', siteInfoRoutes);
router.use('/auth', authRoutes);
router.use('/cases', caseRoutes);
router.use('/clients', clientRoutes);
router.use('/lawyers', lawyerRoutes);
router.use('/users', userRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
