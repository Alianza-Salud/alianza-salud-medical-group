const express = require('express');
const router = express.Router();

const serviceRoutes = require('./serviceRoutes');
const appointmentRoutes = require('./appointmentRoutes');
const contactRoutes = require('./contactRoutes');
const siteInfoRoutes = require('./siteInfoRoutes');
const authRoutes = require('./authRoutes');
const caseRoutes = require('./caseRoutes');
const caseTypeRoutes = require('./caseTypeRoutes');
const clientRoutes = require('./clientRoutes');
const lawyerRoutes = require('./lawyerRoutes');
const userRoutes = require('./userRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const caseReviewRoutes = require('./caseReviewRoutes');
const notificationRoutes = require('./notificationRoutes');

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Alianza Salud Medical Group API REST (Maestros, Etapas & Notificaciones)',
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
router.use('/case-types', caseTypeRoutes);
router.use('/clients', clientRoutes);
router.use('/lawyers', lawyerRoutes);
router.use('/users', userRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/case-reviews', caseReviewRoutes);
router.use('/notifications', notificationRoutes);

module.exports = router;
