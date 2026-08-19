/**
 * Utilidad para la generación de enlaces de videoconferencia en Google Meet.
 */

/**
 * Genera una URL de sala directa de Google Meet o plantilla de agendamiento.
 * @returns {string} URL activa de Google Meet
 */
function generateMeetUrl() {
  return 'https://meet.google.com/new';
}

module.exports = {
  generateMeetUrl,
};
