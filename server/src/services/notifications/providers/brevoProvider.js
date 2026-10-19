const axios = require('axios');
const emailConfig = require('../../../config/emailConfig');

/**
 * Brevo Transactional Email Transport Provider.
 * Encapsula la comunicación con la API de Brevo (v3 SMTP).
 * Si no existe BREVO_API_KEY o falla la red, retorna el resultado de forma segura sin romper la app.
 */
class BrevoProvider {
  async sendEmail({ to, subject, htmlContent, textContent, replyTo }) {
    const currentApiKey = emailConfig.apiKey;

    if (!currentApiKey) {
      console.log('[Notification] Email simulated because provider credentials are not configured.');
      return {
        success: true,
        messageId: `simulated-brevo-${Date.now()}`,
        simulated: true,
      };
    }

    console.log('[Notification] Sending transactional email through configured provider.');

    try {
      const payload = {
        sender: {
          name: emailConfig.senderName,
          email: emailConfig.senderEmail,
        },
        to: Array.isArray(to) ? to.map((e) => ({ email: e })) : [{ email: to }],
        subject,
        htmlContent,
        textContent: textContent || subject,
      };

      if (replyTo) {
        payload.replyTo = { email: replyTo };
      }

      const response = await axios.post(emailConfig.apiUrl, payload, {
        headers: {
          'accept': 'application/json',
          'api-key': currentApiKey,
          'content-type': 'application/json',
        },
        timeout: 10000,
      });

      console.log('[Notification] Transactional email accepted by provider.');

      return {
        success: true,
        messageId: response.data.messageId || `brevo-${Date.now()}`,
        data: response.data,
      };
    } catch (error) {
      console.error('[Notification] Transactional email provider request failed.');
      return {
        success: false,
        error: 'No fue posible entregar el correo mediante el proveedor configurado.',
      };
    }
  }
}

module.exports = new BrevoProvider();
