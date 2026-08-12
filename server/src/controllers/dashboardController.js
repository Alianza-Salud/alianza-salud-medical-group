const appointmentRepository = require('../repositories/appointmentRepository');
const contactRepository = require('../repositories/contactRepository');

/**
 * Obtener estadísticas globales y contadores de pendientes para el Dashboard.
 * GET /api/dashboard/stats
 */
async function getDashboardStats(req, res, next) {
  try {
    const userRole = req.user?.role;
    const lawyerId = userRole === 'lawyer' ? req.user?.id : null;

    const [pendingAppointments, unreadMessages] = await Promise.all([
      appointmentRepository.getPendingCount(lawyerId),
      contactRepository.getUnreadCount(),
    ]);

    return res.json({
      success: true,
      data: {
        pendingAppointments,
        unreadMessages,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDashboardStats,
};
