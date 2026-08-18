const caseTypeRepository = require('../repositories/caseTypeRepository');

async function getCaseTypes(req, res, next) {
  try {
    const { all } = req.query;
    // Si all=true (modo admin en configuración), retornar todos. De lo contrario solo los activos.
    const caseTypes = all === 'true'
      ? await caseTypeRepository.findAll()
      : await caseTypeRepository.findActive();

    return res.json({
      success: true,
      data: caseTypes,
    });
  } catch (error) {
    next(error);
  }
}

async function createCaseType(req, res, next) {
  try {
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        error: { message: 'El nombre del tipo de caso es obligatorio.', status: 400 },
      });
    }

    const newCaseType = await caseTypeRepository.create({
      name: name.trim(),
      description: description ? description.trim() : '',
    });

    return res.status(201).json({
      success: true,
      message: 'Tipo de caso creado exitosamente.',
      data: newCaseType,
    });
  } catch (error) {
    next(error);
  }
}

async function updateCaseType(req, res, next) {
  try {
    const { id } = req.params;
    const { name, description, isActive } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        error: { message: 'El nombre del tipo de caso es obligatorio.', status: 400 },
      });
    }

    const updated = await caseTypeRepository.update(parseInt(id, 10), {
      name: name.trim(),
      description: description ? description.trim() : '',
      isActive: Boolean(isActive),
    });

    return res.json({
      success: true,
      message: 'Tipo de caso actualizado exitosamente.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}

async function deleteCaseType(req, res, next) {
  try {
    const { id } = req.params;
    await caseTypeRepository.delete(parseInt(id, 10));

    return res.json({
      success: true,
      message: 'Tipo de caso eliminado exitosamente.',
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCaseTypes,
  createCaseType,
  updateCaseType,
  deleteCaseType,
};
