require('dotenv').config();

/**
 * Configuración del Servicio de Notificaciones Transaccionales (Brevo Provider).
 * Utiliza getters dinámicos para leer siempre las últimas variables del archivo .env
 */
const emailConfig = {
  get apiKey() {
    require('dotenv').config();
    return (process.env.BREVO_API_KEY || '').trim();
  },
  get senderEmail() {
    require('dotenv').config();
    return (process.env.BREVO_SENDER_EMAIL || 'notificaciones@alianzasalud.com').trim();
  },
  get senderName() {
    require('dotenv').config();
    return (process.env.BREVO_SENDER_NAME || 'Alianza Salud Medical Group').trim();
  },
  get adminEmail() {
    require('dotenv').config();
    return (process.env.BREVO_ADMIN_EMAIL || 'contacto@alianzasalud.com').trim();
  },
  apiUrl: 'https://api.brevo.com/v3/smtp/email',
};

module.exports = emailConfig;
