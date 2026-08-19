/**
 * Utilidad para la generación de enlaces de videoconferencia en Google Meet.
 */

/**
 * Genera un código de reunión de Google Meet válido en formato xxx-yyyy-zzz (3-4-3 letras minúsculas).
 */
function generateMeetCode() {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  const getRandomPart = (len) => {
    let result = '';
    for (let i = 0; i < len; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };
  return `${getRandomPart(3)}-${getRandomPart(4)}-${getRandomPart(3)}`;
}

/**
 * Genera una URL completa de Google Meet.
 * @returns {string} URL formateada ej. https://meet.google.com/abc-defg-hij
 */
function generateMeetUrl() {
  return `https://meet.google.com/${generateMeetCode()}`;
}

module.exports = {
  generateMeetCode,
  generateMeetUrl,
};
