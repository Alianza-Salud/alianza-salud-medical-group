const caseRepository = require('../repositories/caseRepository');
const { canUserAccessCase, canUserModifyCase } = require('../services/caseAccessService');

function authorizeCase(checkAccess) {
  return async (req, res, next) => {
    try {
      const caseData = await caseRepository.findById(req.params.id);
      if (!caseData) {
        return res.status(404).json({ success: false, error: { message: 'Caso no encontrado.', status: 404 } });
      }
      if (!(await checkAccess(req.user, caseData))) {
        return res.status(403).json({ success: false, error: { message: 'No tiene permiso para acceder a este caso.', status: 403 } });
      }
      req.caseData = caseData;
      next();
    } catch (error) {
      next(error);
    }
  };
}

const requireCaseRead = authorizeCase(canUserAccessCase);
const requireCaseModify = authorizeCase(canUserModifyCase);
module.exports = { requireCaseRead, requireCaseModify };
