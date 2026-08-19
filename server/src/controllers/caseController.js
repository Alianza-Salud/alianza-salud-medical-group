const fs = require('fs');
const path = require('path');
const caseRepository = require('../repositories/caseRepository');
const lawyerRepository = require('../repositories/lawyerRepository');
const clientRepository = require('../repositories/clientRepository');
const storageService = require('../storage/StorageService');
const notificationService = require('../services/notifications/notificationService');

async function getCases(req, res, next) {
  try {
    const { id: userId, role, email, fullName } = req.user;

    let cases = [];
    if (role === 'admin' || role === 'auxiliar_admisiones') {
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
    const { clientId, serviceSlug, caseType, title, description, lawyerId, lawyerIds, assignedLawyerName } = req.body;

    if (!clientId || !serviceSlug || !title || !description) {
      return res.status(400).json({
        success: false,
        error: { message: 'Seleccione un Cliente existente, Servicio médico-pericial, Título y Descripción.', status: 400 },
      });
    }

    const newCase = await caseRepository.createCase({
      clientId: parseInt(clientId, 10),
      serviceSlug,
      caseType: caseType || 'Peritaje Médico General',
      title,
      description,
      lawyerId: lawyerId ? parseInt(lawyerId, 10) : null,
      lawyerIds: Array.isArray(lawyerIds) ? lawyerIds.map((id) => parseInt(id, 10)) : [],
      assignedLawyerName: assignedLawyerName || 'Equipo Jurídico Alianza Salud',
    });

    const client = await clientRepository.findById(parseInt(clientId, 10));

    // Disparar evento CASE_CREATED
    if (client) {
      notificationService.emit('CASE_CREATED', {
        fullName: client.fullName,
        email: client.email,
        caseCode: newCase.case_code || `CASO-${newCase.id}`,
        serviceSlug: newCase.service_slug,
        stage: newCase.stage,
        status: newCase.status,
        caseId: newCase.id,
        clientId: client.id,
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Caso aperturado y vinculado al cliente exitosamente.',
      data: newCase,
    });
  } catch (error) {
    next(error);
  }
}

async function updateCaseLawyers(req, res, next) {
  try {
    const { id: caseId } = req.params;
    const { lawyerIds } = req.body;

    if (!Array.isArray(lawyerIds)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Envíe una lista de especialistas válidos.', status: 400 },
      });
    }

    const parsedIds = lawyerIds.map((id) => parseInt(id, 10)).filter((id) => !isNaN(id));
    await caseRepository.updateCaseLawyers(parseInt(caseId, 10), parsedIds);
    const updatedCase = await caseRepository.findById(caseId);

    return res.json({
      success: true,
      message: 'Especialistas asignados al caso actualizados exitosamente.',
      data: updatedCase,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Avanzar o cambiar la etapa del caso.
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

    const previousCaseData = await caseRepository.findById(caseId);
    await caseRepository.updateStage(parseInt(caseId, 10), stageName, status || 'in_progress');

    await caseRepository.addUpdate({
      caseId: parseInt(caseId, 10),
      createdByName: req.user.fullName || 'Administración',
      title: status === 'closed' ? `Cierre del Caso — Etapa: ${stageName}` : `Avance a Etapa: ${stageName}`,
      description: status === 'closed' ? `El caso ha sido cerrado y finalizado formalmente en la plataforma.` : `El caso ha sido promovido a la etapa "${stageName}".`,
      stageName,
      updateStageStatus: false,
    });

    const updatedCase = await caseRepository.findById(caseId);

    if (updatedCase) {
      notificationService.emit('CASE_STAGE_CHANGED', {
        fullName: updatedCase.clientName,
        email: updatedCase.clientEmail,
        caseCode: updatedCase.caseCode || `CASO-${caseId}`,
        previousStage: previousCaseData ? previousCaseData.stage : '',
        newStage: stageName,
        caseId: parseInt(caseId, 10),
        clientId: updatedCase.clientId,
      });
    }

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
    const { title, description, stageName, visibleForClient } = req.body;

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

    const caseData = await caseRepository.findById(caseId);
    const isVisible = visibleForClient !== false && visibleForClient !== 'false';

    if (caseData && isVisible) {
      notificationService.emit('CASE_UPDATED', {
        fullName: caseData.clientName,
        email: caseData.clientEmail,
        caseCode: caseData.caseCode || `CASO-${caseId}`,
        title,
        summary: description,
        visible_for_client: true,
        caseId: parseInt(caseId, 10),
        clientId: caseData.clientId,
      });
    }

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

    const files = req.files && req.files.length > 0 ? req.files : (req.file ? [req.file] : []);
    const isVisible = visibleToClient === true || visibleToClient === 'true' || visibleToClient === '1';

    const createdDocs = [];

    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const docName = files.length === 1 && name && name.trim() ? name.trim() : file.originalname;

        const stored = await storageService.uploadFile(file.path, file.originalname, file.mimetype);

        const doc = await caseRepository.addDocument({
          caseId: parseInt(caseId, 10),
          name: docName,
          type: type || 'recibido',
          description: description || '',
          filePath: `/uploads/documents/${file.filename}`,
          storageKey: stored.storageKey,
          checksum: stored.checksum,
          originalName: file.originalname,
          mimeType: file.mimetype,
          fileSize: stored.size,
          uploadedByName: req.user.fullName || 'Administración',
          visibleToClient: isVisible,
          status: 'ready',
        });

        if (fs.existsSync(file.path)) {
          try { await fs.promises.unlink(file.path); } catch (err) {}
        }

        createdDocs.push(doc);
      }
    } else {
      const doc = await caseRepository.addDocument({
        caseId: parseInt(caseId, 10),
        name: name || 'Documento sin archivo',
        type: type || 'recibido',
        description: description || '',
        filePath: '',
        storageKey: '',
        checksum: '',
        originalName: '',
        mimeType: '',
        fileSize: null,
        uploadedByName: req.user.fullName || 'Administración',
        visibleToClient: isVisible,
        status: 'ready',
      });
      createdDocs.push(doc);
    }

    // Disparar evento DOCUMENT_UPLOADED si es visible para cliente
    const caseData = await caseRepository.findById(caseId);
    if (caseData && isVisible) {
      for (const createdDoc of createdDocs) {
        notificationService.emit('DOCUMENT_UPLOADED', {
          fullName: caseData.clientName,
          email: caseData.clientEmail,
          caseCode: caseData.caseCode || `CASO-${caseId}`,
          documentName: createdDoc.name,
          visible_for_client: true,
          caseId: parseInt(caseId, 10),
          clientId: caseData.clientId,
        });
      }
    }

    const message = createdDocs.length > 1
      ? `${createdDocs.length} documentos subidos y registrados exitosamente en el expediente.`
      : 'Documento subido y registrado exitosamente en el expediente.';

    return res.status(201).json({
      success: true,
      message,
      data: createdDocs.length === 1 ? createdDocs[0] : createdDocs,
    });
  } catch (error) {
    next(error);
  }
}

async function downloadCaseDocument(req, res, next) {
  try {
    const { id: caseId, docId } = req.params;
    const doc = await caseRepository.findDocumentById(parseInt(docId, 10));

    if (!doc || doc.caseId !== parseInt(caseId, 10)) {
      return res.status(404).json({ success: false, message: 'Documento no encontrado en este expediente.' });
    }

    if (req.user.role === 'client' && !doc.visibleToClient) {
      return res.status(403).json({ success: false, message: 'No tiene autorización para descargar este documento.' });
    }

    if (doc.storageKey && (await storageService.exists(doc.storageKey))) {
      const stream = storageService.getReadStream(doc.storageKey);
      const safeFilename = doc.originalName || doc.name || 'documento.pdf';
      res.setHeader('Content-Type', doc.mimeType || 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(safeFilename)}"`);
      return stream.pipe(res);
    }

    if (doc.filePath) {
      const legacyAbsolutePath = path.join(__dirname, '../../', doc.filePath);
      if (fs.existsSync(legacyAbsolutePath)) {
        const safeFilename = doc.originalName || doc.name || 'documento.pdf';
        return res.download(legacyAbsolutePath, safeFilename);
      }
    }

    return res.status(404).json({ success: false, message: 'El archivo físico del documento no está disponible en el servidor.' });
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

async function updateDocumentVisibility(req, res, next) {
  try {
    const { docId } = req.params;
    const { visibleToClient } = req.body;

    if (visibleToClient === undefined) {
      return res.status(400).json({
        success: false,
        error: { message: 'Indique el estado de visibilidad para el cliente (visibleToClient).', status: 400 },
      });
    }

    const isVisible = visibleToClient === true || visibleToClient === 'true' || visibleToClient === '1' || visibleToClient === 1;
    await caseRepository.updateDocumentVisibility(parseInt(docId, 10), isVisible);

    return res.json({
      success: true,
      message: `Visibilidad del documento ${isVisible ? 'activada' : 'desactivada'} para el cliente.`,
      data: { id: parseInt(docId, 10), visibleToClient: isVisible },
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
  downloadCaseDocument,
  getCaseDocuments,
  updateCaseLawyers,
  updateDocumentVisibility,
};
