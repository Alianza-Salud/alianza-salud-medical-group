const appointmentRepository = require('../repositories/appointmentRepository');
const contactRepository = require('../repositories/contactRepository');
const caseReviewRepository = require('../repositories/caseReviewRepository');

/**
 * Obtener estadísticas globales y contadores de pendientes para el Dashboard.
 * GET /api/dashboard/stats
 */
async function getDashboardStats(req, res, next) {
  try {
    const userRole = req.user?.role;
    const lawyerId = userRole === 'lawyer' ? req.user?.id : null;

    const [pendingAppointments, unreadMessages, pendingCaseReviews] = await Promise.all([
      appointmentRepository.getPendingCount(lawyerId),
      contactRepository.getUnreadCount(),
      caseReviewRepository.countPending(),
    ]);

    return res.json({
      success: true,
      data: {
        pendingAppointments,
        unreadMessages,
        pendingCaseReviews,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDashboardStats,
};
