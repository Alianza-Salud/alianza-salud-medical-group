require('dotenv').config();

/**
 * Configuración del Servicio de Notificaciones Transaccionales (Brevo Provider)
 */
const emailConfig = {
  apiKey: process.env.BREVO_API_KEY || '',
  senderEmail: process.env.BREVO_SENDER_EMAIL || 'notificaciones@alianzasalud.com',
  senderName: process.env.BREVO_SENDER_NAME || 'Alianza Salud Medical Group',
  adminEmail: process.env.BREVO_ADMIN_EMAIL || 'contacto@alianzasalud.com',
  apiUrl: 'https://api.brevo.com/v3/smtp/email',
};

module.exports = emailConfig;
