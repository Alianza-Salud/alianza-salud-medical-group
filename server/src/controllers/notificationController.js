const notificationRepository = require('../repositories/notificationRepository');
const brevoProvider = require('../services/notifications/providers/brevoProvider');
const emailConfig = require('../config/emailConfig');

/**
 * Obtener configuración de notificaciones y correo empresarial.
 * GET /api/notifications/settings
 */
async function getSettings(req, res, next) {
  try {
    const settings = await notificationRepository.getSettings();
    return res.json({
      success: true,
      data: {
        settings,
        companyEmail: emailConfig.adminEmail,
        senderEmail: emailConfig.senderEmail,
        senderName: emailConfig.senderName,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Actualizar configuración de eventos de notificación.
 * PUT /api/notifications/settings
 */
async function updateSettings(req, res, next) {
  try {
    const { settings, companyEmail, senderEmail, senderName } = req.body;

    if (Array.isArray(settings)) {
      for (const item of settings) {
        if (item.event_type) {
          await notificationRepository.updateSetting(item.event_type, {
            send_to_client: item.send_to_client,
            send_to_admin: item.send_to_admin,
            is_enabled: item.is_enabled,
          });
        }
      }
    }

    if (companyEmail) emailConfig.adminEmail = companyEmail;
    if (senderEmail) emailConfig.senderEmail = senderEmail;
    if (senderName) emailConfig.senderName = senderName;

    return res.json({
      success: true,
      message: 'Configuración de notificaciones actualizada exitosamente.',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Obtener la bitácora de auditoría de notificaciones.
 * GET /api/notifications/logs
 */
async function getLogs(req, res, next) {
  try {
    const { status, recipient_email, event_type, limit = 50, offset = 0 } = req.query;
    const result = await notificationRepository.getLogs({
      status,
      recipient_email,
      event_type,
      limit,
      offset,
    });

    return res.json({
      success: true,
      data: result.logs,
      total: result.total,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Reintentar manualmente el envío de una notificación fallida o pendiente.
 * POST /api/notifications/logs/:id/retry
 */
async function retryLog(req, res, next) {
  try {
    const { id } = req.params;
    const logId = parseInt(id, 10);

    const log = await notificationRepository.getLogById(logId);

    if (!log) {
      return res.status(404).json({
        success: false,
        error: { message: 'Registro de auditoría no encontrado.', status: 404 },
      });
    }

    await notificationRepository.updateLogStatus(logId, {
      status: 'RETRYING',
      retry_count: (log.retry_count || 0) + 1,
    });

    const sendResult = await brevoProvider.sendEmail({
      to: log.recipient_email,
      subject: log.subject,
      htmlContent: `<p>${log.subject}</p>`,
    });

    if (sendResult.success) {
      await notificationRepository.updateLogStatus(logId, {
        status: 'SENT',
        provider_message_id: sendResult.messageId,
      });
      return res.json({ success: true, message: 'Notificación reenviada exitosamente.' });
    } else {
      await notificationRepository.updateLogStatus(logId, {
        status: 'FAILED',
        error_message: sendResult.error || 'Fallo en el reintento manual',
      });
      return res.status(500).json({ success: false, error: { message: sendResult.error || 'Fallo en reintento' } });
    }
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getSettings,
  updateSettings,
  getLogs,
  retryLog,
};
