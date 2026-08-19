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
      console.log(`[Brevo Simulation] Correo a ${to} ("${subject}") simulado en entorno local sin API Key.`);
      return {
        success: true,
        messageId: `simulated-brevo-${Date.now()}`,
        simulated: true,
      };
    }

    console.log(`[Brevo Real API Call] Enviando correo transaccional real a ${to} mediante API Key Brevo...`);

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

      console.log(`[Brevo API Success] Correo entregado exitosamente a ${to}. MessageID: ${response.data.messageId}`);

      return {
        success: true,
        messageId: response.data.messageId || `brevo-${Date.now()}`,
        data: response.data,
      };
    } catch (error) {
      const errorDetails = error.response?.data?.message || error.message;
      console.error(`[Brevo Provider Error] Error enviando correo a ${to}:`, errorDetails);
      return {
        success: false,
        error: errorDetails,
      };
    }
  }
}

module.exports = new BrevoProvider();
