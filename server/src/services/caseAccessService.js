const caseRepository = require('../repositories/caseRepository');

async function canUserAccessCase(user, caseData) {
  if (!user || !caseData) return false;
  if (user.role === 'admin' || user.role === 'auxiliar_admisiones') return true;
  if (user.role === 'lawyer') {
    return caseRepository.isLawyerUserAssigned(caseData.id, user.id);
  }
  if (user.role === 'client') {
    if (Number(caseData.userId) === Number(user.id)) return true;
    return !caseData.userId && Boolean(caseData.clientEmail && user.email)
      && caseData.clientEmail.toLowerCase() === user.email.toLowerCase();
  }
  return false;
}

async function canUserModifyCase(user, caseData) {
  if (!user || !caseData) return false;
  if (user.role === 'admin' || user.role === 'auxiliar_admisiones') return true;
  return user.role === 'lawyer' && caseRepository.isLawyerUserAssigned(caseData.id, user.id);
}

async function canUserReadDocument(user, caseData, document) {
  if (!document || Number(document.caseId) !== Number(caseData && caseData.id)) return false;
  if (!(await canUserAccessCase(user, caseData))) return false;
  return user.role !== 'client' || document.visibleToClient === true;
}

module.exports = { canUserAccessCase, canUserModifyCase, canUserReadDocument };
