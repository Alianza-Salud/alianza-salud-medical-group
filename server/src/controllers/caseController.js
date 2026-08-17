const caseRepository = require('../repositories/caseRepository');

/**
 * Controlador de Casos y Movimientos.
 */

const lawyerRepository = require('../repositories/lawyerRepository');

async function getCases(req, res, next) {
  try {
    const { id: userId, role, email, fullName } = req.user;

    let cases = [];
    if (role === 'admin') {
      cases = await caseRepository.findAll();
    } else if (role === 'lawyer') {
      const lawyers = await lawyerRepository.findAll();
      const match = lawyers.find((l) => l.email.toLowerCase() === email.toLowerCase() || l.fullName === fullName);
      cases = await caseRepository.findByLawyer(match ? match.id : 0, fullName, email);
    } else {
      cases = await caseRepository.findByClientUser(userId, email);
    }

    return res.json({
      success: true,
      data: cases,
    });
  } catch (error) {
    next(error);
  }
}

async function getCaseById(req, res, next) {
  try {
    const { id } = req.params;
    const caseData = await caseRepository.findById(id);

    if (!caseData) {
      return res.status(404).json({
        success: false,
        error: { message: 'Caso no encontrado.', status: 404 },
      });
    }

    if (req.user.role === 'client' && caseData.userId !== req.user.id && caseData.clientEmail !== req.user.email) {
      return res.status(403).json({
        success: false,
        error: { message: 'No tiene permiso para ver este caso.', status: 403 },
      });
    }

    return res.json({
      success: true,
      data: caseData,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Crear caso seleccionando un Cliente existente (clientId).
 */
async function createCase(req, res, next) {
  try {
    const { clientId, serviceSlug, title, description, lawyerId, assignedLawyerName } = req.body;

    if (!clientId || !serviceSlug || !title || !description) {
      return res.status(400).json({
        success: false,
        error: { message: 'Seleccione un Cliente existente, Servicio, Título y Descripción.', status: 400 },
      });
    }

    const newCase = await caseRepository.createCase({
      clientId: parseInt(clientId, 10),
      serviceSlug,
      title,
      description,
      lawyerId: lawyerId ? parseInt(lawyerId, 10) : null,
      assignedLawyerName: assignedLawyerName || 'Equipo Jurídico Alianza Salud',
    });

    return res.status(201).json({
      success: true,
      message: 'Caso aperturado y vinculado al cliente exitosamente.',
      data: newCase,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Avanzar o cambiar la etapa del caso.
 * PATCH /api/cases/:id/stage
 */
async function updateCaseStage(req, res, next) {
  try {
    const { id: caseId } = req.params;
    const { stageName, status } = req.body;

    if (!stageName) {
      return res.status(400).json({
        success: false,
        error: { message: 'Debe ingresar la nueva etapa del caso.', status: 400 },
      });
    }

    await caseRepository.updateStage(parseInt(caseId, 10), stageName, status || 'in_progress');

    // Registrar novedad automática del cambio de etapa sin sobreescribir el status
    await caseRepository.addUpdate({
      caseId: parseInt(caseId, 10),
      createdByName: req.user.fullName || 'Administración',
      title: status === 'closed' ? `Cierre del Caso — Etapa: ${stageName}` : `Avance a Etapa: ${stageName}`,
      description: status === 'closed' ? `El caso ha sido cerrado y finalizado formalmente en la plataforma.` : `El caso ha sido promovido a la etapa "${stageName}".`,
      stageName,
      updateStageStatus: false,
    });

    const updatedCase = await caseRepository.findById(caseId);

    return res.json({
      success: true,
      message: 'Etapa del caso actualizada exitosamente.',
      data: updatedCase,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Agregar novedad/movimiento a un caso.
 */
async function addCaseUpdate(req, res, next) {
  try {
    const { id: caseId } = req.params;
    const { title, description, stageName } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        error: { message: 'Ingrese título y descripción de la novedad.', status: 400 },
      });
    }

    const update = await caseRepository.addUpdate({
      caseId: parseInt(caseId, 10),
      createdByName: req.user.fullName || 'Administración',
      title,
      description,
      stageName: stageName || 'Seguimiento',
    });

    return res.status(201).json({
      success: true,
      message: 'Novedad / Movimiento registrado en el caso.',
      data: update,
    });
  } catch (error) {
    next(error);
  }
}

async function addCaseDocument(req, res, next) {
  try {
    const { id: caseId } = req.params;
    const { name, type, description, visibleToClient } = req.body;
    const file = req.file;

    const documentName = name || (file ? file.originalname : 'Documento sin nombre');

    let filePath = '';
    let originalName = '';
    let mimeType = '';
    let fileSize = null;

    if (file) {
      filePath = `/uploads/documents/${file.filename}`;
      originalName = file.originalname;
      mimeType = file.mimetype;
      fileSize = file.size;
    }

    const doc = await caseRepository.addDocument({
      caseId: parseInt(caseId, 10),
      name: documentName,
      type: type || 'recibido',
      description: description || '',
      filePath,
      originalName,
      mimeType,
      fileSize,
      uploadedByName: req.user.fullName || 'Administración',
      visibleToClient: visibleToClient === true || visibleToClient === 'true' || visibleToClient === '1',
    });

    return res.status(201).json({
      success: true,
      message: 'Documento subido y registrado exitosamente en el expediente.',
      data: doc,
    });
  } catch (error) {
    next(error);
  }
}

async function getCaseDocuments(req, res, next) {
  try {
    const { id: caseId } = req.params;
    const isClient = req.user.role === 'client';
    const docs = await caseRepository.findDocumentsByCaseId(parseInt(caseId, 10), isClient);
    return res.json({
      success: true,
      data: docs,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCases,
  getCaseById,
  createCase,
  updateCaseStage,
  addCaseUpdate,
  addCaseDocument,
  getCaseDocuments,
};
