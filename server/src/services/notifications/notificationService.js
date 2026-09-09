const EventEmitter = require('events');
const notificationRepository = require('../../repositories/notificationRepository');
const brevoProvider = require('./providers/brevoProvider');
const templates = require('./templates/templatesIndex');
const emailConfig = require('../../config/emailConfig');

class NotificationService extends EventEmitter {
  constructor() {
    super();
    this.registerEventListeners();
  }

  registerEventListeners() {
    this.on('CLIENT_CREATED', (data) => this.handleClientCreated(data));
    this.on('APPOINTMENT_REQUESTED', (data) => this.handleAppointmentRequested(data));
    this.on('APPOINTMENT_CONFIRMED', (data) => this.handleAppointmentConfirmed(data));
    this.on('APPOINTMENT_CANCELLED', (data) => this.handleAppointmentCancelled(data));
    this.on('PETITION_SUBMITTED', (data) => this.handlePetitionSubmitted(data));
    this.on('CONTACT_SUBMITTED', (data) => this.handleContactSubmitted(data));
    this.on('CASE_CREATED', (data) => this.handleCaseCreated(data));
    this.on('CASE_UPDATED', (data) => this.handleCaseUpdated(data));
    this.on('DOCUMENT_UPLOADED', (data) => this.handleDocumentUploaded(data));
    this.on('CASE_STAGE_CHANGED', (data) => this.handleCaseStageChanged(data));
  }

  // --- Handlers para cada evento con soporte camelCase / snake_case ---

  async handleClientCreated(data) {
    const fullName = data.fullName || data.full_name || 'Cliente';
    const clientCode = data.clientCode || data.verificationCode || data.verification_code || 'SIN_CODIGO';
    const { email, clientId } = data;
    if (!email) return;

    await this.dispatchNotification({
      eventType: 'CLIENT_CREATED',
      recipientEmail: email,
      recipientType: 'client',
      templateName: 'CLIENT_CREATED',
      templateData: { fullName, clientCode },
      relatedClientId: clientId,
    });
  }

  async handleAppointmentRequested(data) {
    const fullName = data.fullName || data.full_name || 'Cliente';
    const { email, phone, serviceType, preferredDate, preferredTime, message } = data;

    await this.dispatchNotification({
      eventType: 'APPOINTMENT_REQUESTED',
      recipientEmail: emailConfig.adminEmail,
      recipientType: 'admin',
      templateName: 'APPOINTMENT_REQUESTED_ADMIN',
      templateData: { fullName, email, phone, serviceType, preferredDate, preferredTime, message },
    });

    if (email) {
      await this.dispatchNotification({
        eventType: 'APPOINTMENT_REQUESTED',
        recipientEmail: email,
        recipientType: 'client',
        templateName: 'APPOINTMENT_REQUESTED_CLIENT',
        templateData: { fullName, serviceType, preferredDate, preferredTime },
      });
    }
  }

  async handleAppointmentConfirmed(data) {
    const fullName = data.fullName || data.full_name || 'Cliente';
    const { email, serviceType, date, time, modality, meetLink } = data;
    if (!email) return;

    await this.dispatchNotification({
      eventType: 'APPOINTMENT_CONFIRMED',
      recipientEmail: email,
      recipientType: 'client',
      templateName: 'APPOINTMENT_CONFIRMED',
      templateData: { fullName, serviceType, date, time, modality, meetLink },
    });
  }

  async handleAppointmentCancelled(data) {
    const fullName = data.fullName || data.full_name || 'Cliente';
    const { email, date, time, reason } = data;
    if (!email) return;

    await this.dispatchNotification({
      eventType: 'APPOINTMENT_CANCELLED',
      recipientEmail: email,
      recipientType: 'client',
      templateName: 'APPOINTMENT_CANCELLED',
      templateData: { fullName, date, time, reason },
    });
  }

  async handlePetitionSubmitted(data) {
    const fullName = data.fullName || data.full_name || 'Cliente';
    const { email, phone, caseType, documentsCount, description } = data;

    await this.dispatchNotification({
      eventType: 'PETITION_SUBMITTED',
      recipientEmail: emailConfig.adminEmail,
      recipientType: 'admin',
      templateName: 'PETITION_SUBMITTED_ADMIN',
      templateData: { fullName, email, phone, caseType, documentsCount, description },
    });

    if (email) {
      await this.dispatchNotification({
        eventType: 'PETITION_SUBMITTED',
        recipientEmail: email,
        recipientType: 'client',
        templateName: 'PETITION_SUBMITTED_CLIENT',
        templateData: { fullName, caseType },
      });
    }
  }

  async handleContactSubmitted(data) {
    const fullName = data.fullName || data.full_name || 'Usuario';
    const { email, phone, subject, message } = data;

    await this.dispatchNotification({
      eventType: 'CONTACT_SUBMITTED',
      recipientEmail: emailConfig.adminEmail,
      recipientType: 'admin',
      templateName: 'CONTACT_SUBMITTED_ADMIN',
      templateData: { fullName, email, phone, subject, message },
    });

    if (email) {
      await this.dispatchNotification({
        eventType: 'CONTACT_SUBMITTED',
        recipientEmail: email,
        recipientType: 'client',
        templateName: 'CONTACT_SUBMITTED_CLIENT',
        templateData: { fullName },
      });
    }
  }

  async handleCaseCreated(data) {
    const fullName = data.fullName || data.full_name || 'Cliente';
    const caseCode = data.caseCode || data.case_code || 'CASO-NUEVO';
    const { email, serviceSlug, stage, status, caseId, clientId } = data;
    if (!email) return;

    await this.dispatchNotification({
      eventType: 'CASE_CREATED',
      recipientEmail: email,
      recipientType: 'client',
      templateName: 'CASE_CREATED',
      templateData: { fullName, caseCode, serviceSlug, stage, status },
      relatedCaseId: caseId,
      relatedClientId: clientId,
    });
  }

  async handleCaseUpdated(data) {
    const fullName = data.fullName || data.full_name || 'Cliente';
    const caseCode = data.caseCode || data.case_code || 'CASO-NUEVO';
    const { email, title, summary, visible_for_client, caseId, clientId } = data;
    if (!email || visible_for_client === false) return;

    await this.dispatchNotification({
      eventType: 'CASE_UPDATED',
      recipientEmail: email,
      recipientType: 'client',
      templateName: 'CASE_UPDATED',
      templateData: { fullName, caseCode, title, summary },
      relatedCaseId: caseId,
      relatedClientId: clientId,
    });
  }

  async handleDocumentUploaded(data) {
    const fullName = data.fullName || data.full_name || 'Cliente';
    const caseCode = data.caseCode || data.case_code || 'CASO-NUEVO';
    const { email, documentName, visible_for_client, caseId, clientId } = data;
    if (!email || visible_for_client === false) return;

    await this.dispatchNotification({
      eventType: 'DOCUMENT_UPLOADED',
      recipientEmail: email,
      recipientType: 'client',
      templateName: 'DOCUMENT_UPLOADED',
      templateData: { fullName, caseCode, documentName },
      relatedCaseId: caseId,
      relatedClientId: clientId,
    });
  }

  async handleCaseStageChanged(data) {
    const fullName = data.fullName || data.full_name || 'Cliente';
    const caseCode = data.caseCode || data.case_code || 'CASO-NUEVO';
    const { email, previousStage, newStage, caseId, clientId } = data;
    if (!email) return;

    await this.dispatchNotification({
      eventType: 'CASE_STAGE_CHANGED',
      recipientEmail: email,
      recipientType: 'client',
      templateName: 'CASE_STAGE_CHANGED',
      templateData: { fullName, caseCode, previousStage, newStage },
      relatedCaseId: caseId,
      relatedClientId: clientId,
    });
  }

  // --- Motor Central de Despacho de Notificaciones ---

  async dispatchNotification({ eventType, recipientEmail, recipientType, templateName, templateData, relatedClientId, relatedCaseId }) {
    try {
      const setting = await notificationRepository.getSettingByEvent(eventType);
      if (setting && setting.is_enabled === 0) return;

      if (setting) {
        if (recipientType === 'client' && setting.send_to_client === 0) return;
        if (recipientType === 'admin' && setting.send_to_admin === 0) return;
      }

      const templateFn = templates[templateName];
      if (!templateFn) {
        console.error(`[NotificationService] Plantilla ${templateName} no encontrada.`);
        return;
      }

      const { subject, html } = templateFn(templateData);

      // 1. Crear registro inicial (PENDING)
      const logId = await notificationRepository.createLog({
        event_type: eventType,
        recipient_email: recipientEmail,
        recipient_type: recipientType,
        subject,
        status: 'PENDING',
        related_client_id: relatedClientId,
        related_case_id: relatedCaseId,
      });

      // 2. Intentar envío por Brevo Provider
      let result;
      try {
        result = await brevoProvider.sendEmail({
          to: recipientEmail,
          subject,
          htmlContent: html,
        });
      } catch (err) {
        result = { success: false, error: err.message };
      }

      // 3. Garantizar la actualización del estado desde PENDING a SENT o FAILED
      if (logId) {
        if (result && result.success) {
          await notificationRepository.updateLogStatus(logId, {
            status: 'SENT',
            provider_message_id: result.messageId,
          });
        } else {
          await notificationRepository.updateLogStatus(logId, {
            status: 'FAILED',
            error_message: (result && result.error) || 'Fallo al procesar envío',
          });
        }
      }
    } catch (error) {
      console.error(`[NotificationService Catch Error en evento ${eventType}]:`, error.message);
    }
  }

  /**
   * Reintentar notificaciones fallidas o pendientes estancadas
   */
  async retryFailedNotifications() {
    try {
      const failedLogs = await notificationRepository.getFailedLogs(3);
      if (failedLogs.length === 0) return;

      console.log(`[NotificationService] Reintentando ${failedLogs.length} notificaciones fallidas...`);

      for (const log of failedLogs) {
        await notificationRepository.updateLogStatus(log.id, {
          status: 'RETRYING',
          retry_count: log.retry_count + 1,
        });

        const result = await brevoProvider.sendEmail({
          to: log.recipient_email,
          subject: log.subject,
          htmlContent: `<p>${log.subject}</p>`,
        });

        if (result.success) {
          await notificationRepository.updateLogStatus(log.id, {
            status: 'SENT',
            provider_message_id: result.messageId,
          });
        } else {
          await notificationRepository.updateLogStatus(log.id, {
            status: 'FAILED',
            error_message: result.error || 'Fallo al reintentar',
          });
        }
      }
    } catch (error) {
      console.error('[NotificationService.retryFailedNotifications Error]:', error.message);
    }
  }
}

const notificationService = new NotificationService();
module.exports = notificationService;
