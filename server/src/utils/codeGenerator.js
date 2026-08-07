/**
 * Generador de códigos alfanuméricos de 8 caracteres.
 * Utiliza caracteres en mayúscula y números excluyendo confusos (O, 0, I, 1).
 * Ejemplo: AS7K9X2M
 */
function generateVerificationCode(length = 8) {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generador de código consecutivo de caso.
 * Ejemplo: CAS-2026-001
 */
function generateCaseCode(sequenceNumber) {
  const year = new Date().getFullYear();
  const numStr = String(sequenceNumber).padStart(3, '0');
  return `CAS-${year}-${numStr}`;
}

module.exports = {
  generateVerificationCode,
  generateCaseCode,
};
