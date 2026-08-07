const lawyerRepository = require('../repositories/lawyerRepository');

/**
 * Controlador de Maestro de Abogados y Especialistas Médicos.
 */

async function getLawyers(req, res, next) {
  try {
    const lawyers = await lawyerRepository.findAll();
    return res.json({ success: true, data: lawyers });
  } catch (error) {
    next(error);
  }
}

async function createLawyer(req, res, next) {
  try {
    const { fullName, email, phone, specialty, roleType } = req.body;

    if (!fullName || !email) {
      return res.status(400).json({
        success: false,
        error: { message: 'Nombre completo y correo son obligatorios.', status: 400 },
      });
    }

    const newLawyer = await lawyerRepository.create({ fullName, email, phone, specialty, roleType });
    return res.status(201).json({
      success: true,
      message: 'Abogado/Especialista registrado exitosamente.',
      data: newLawyer,
    });
  } catch (error) {
    next(error);
  }
}

async function updateLawyer(req, res, next) {
  try {
    const { id } = req.params;
    const { fullName, email, phone, specialty, roleType, isActive } = req.body;

    const updated = await lawyerRepository.update(id, { fullName, email, phone, specialty, roleType, isActive });
    return res.json({
      success: true,
      message: 'Datos del profesional actualizados.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getLawyers,
  createLawyer,
  updateLawyer,
};
