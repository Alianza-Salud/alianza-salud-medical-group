const caseReviewRepository = require('../repositories/caseReviewRepository');
const caseRepository = require('../repositories/caseRepository');
const clientRepository = require('../repositories/clientRepository');
const storageService = require('../storage/StorageService');
const notificationService = require('../services/notifications/notificationService');
const fs = require('fs');
const path = require('path');

function resolveLegacyUploadPath(filePath) {
  const root = path.resolve(__dirname, '../../uploads');
  const relativePath = String(filePath || '').replace(/^[/\\]*uploads[/\\]*/i, '');
  const candidate = path.resolve(root, relativePath);
  if (candidate === root || !candidate.startsWith(`${root}${path.sep}`)) return null;
  return candidate;
}

function toPublicPetition(petition) {
  return {
    ...petition,
    documents: (petition.documents || []).map((document) => ({
      name: document.name,
      mimeType: document.mimeType,
      size: document.size,
      downloadAvailable: Boolean(document.storageKey || document.filePath),
    })),
  };
}

async function createRequest(req, res, next) {
  try {
    const { fullName, email, phone, caseType, description } = req.body;

    if (!fullName || !email || !phone || !caseType) {
      return res.status(400).json({
        success: false,
        error: { message: 'Nombre completo, correo, teléfono y tipo de caso son obligatorios.', status: 400 },
      });
    }

    const files = req.files && req.files.length > 0 ? req.files : (req.file ? [req.file] : []);
    const storedDocs = [];

    for (const file of files) {
      try {
        const stored = await storageService.uploadFile(file.path, file.originalname, file.mimetype);
        storedDocs.push({
          name: file.originalname,
          storageKey: stored.storageKey,
          mimeType: file.mimetype,
          size: stored.size,
        });

      } catch (err) {
        console.error('[CaseReviewController] Private file storage failed.');
        throw err;
      } finally {
        await fs.promises.unlink(file.path).catch(() => {});
      }
    }

    const petition = await caseReviewRepository.create({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      caseType: caseType.trim(),
      description: description ? description.trim() : '',
      documents: storedDocs,
    });

    // Disparar evento de notificación de solicitud de revisión
    notificationService.emit('PETITION_SUBMITTED', {
      fullName: petition.fullName,
      email: petition.email,
      phone: petition.phone,
      caseType: petition.caseType,
      documentsCount: storedDocs.length,
      description: petition.description,
    });

    return res.status(201).json({
      success: true,
      message: 'Solicitud de revisión preliminar recibida exitosamente.',
      data: { id: petition.id, status: petition.status, createdAt: petition.createdAt },
    });
  } catch (error) {
    next(error);
  }
}

async function getRequests(req, res, next) {
  try {
    const { status } = req.query;
    const petitions = await caseReviewRepository.findAll(status);
    return res.json({
      success: true,
      data: petitions.map(toPublicPetition),
    });
  } catch (error) {
    next(error);
  }
}

async function updateRequestStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        error: { message: 'Debe proporcionar el nuevo estado.', status: 400 },
      });
    }

    await caseReviewRepository.updateStatus(parseInt(id, 10), status, adminNotes || '');

    return res.json({
      success: true,
      message: 'Estado de la solicitud de revisión actualizado exitosamente.',
      data: { id: parseInt(id, 10), status, adminNotes },
    });
  } catch (error) {
    next(error);
  }
}

async function convertToCase(req, res, next) {
  try {
    const { id } = req.params;
    const { clientId, clientData } = req.body || {};
    const petition = await caseReviewRepository.findById(parseInt(id, 10));

    if (!petition) {
      return res.status(404).json({
        success: false,
        error: { message: 'Solicitud de revisión no encontrada.', status: 404 },
      });
    }

    let client = null;

    if (clientId) {
      client = await clientRepository.findById(parseInt(clientId, 10));
      if (!client) {
        return res.status(404).json({
          success: false,
          error: { message: 'El cliente seleccionado no existe en el Maestro de Clientes.', status: 404 },
        });
      }
    } else {
      const nameToUse = (clientData && clientData.fullName) || petition.fullName;
      const emailToUse = (clientData && clientData.email) || petition.email;
      const phoneToUse = (clientData && clientData.phone) || petition.phone;
      const docIdToUse = (clientData && clientData.documentId) || '';
      const addressToUse = (clientData && clientData.address) || '';

      const existingClient = await clientRepository.findByEmail(emailToUse);
      if (existingClient) {
        return res.status(400).json({
          success: false,
          error: {
            message: `No es posible crear el nuevo cliente porque el correo "${emailToUse}" ya se encuentra registrado en el Maestro de Clientes (Cliente: ${existingClient.fullName}). Por favor seleccione la opción "Seleccionar un cliente existente del Maestro".`,
            status: 400,
          },
        });
      }

      client = await clientRepository.create({
        fullName: nameToUse,
        email: emailToUse,
        phone: phoneToUse,
        documentId: docIdToUse,
        address: addressToUse,
      });

      // Disparar evento CLIENT_CREATED
      notificationService.emit('CLIENT_CREATED', {
        fullName: client.fullName,
        email: client.email,
        clientCode: client.verificationCode,
        clientId: client.id,
      });
    }

    const newCase = await caseRepository.createCase({
      clientId: client.id,
      title: `${petition.caseType} — ${client.fullName}`,
      caseType: petition.caseType,
      serviceSlug: 'pclo-dictamen',
      description: petition.description || 'Expediente aperturado desde Solicitud de Revisión Preliminar.',
    });

    // Disparar evento CASE_CREATED
    notificationService.emit('CASE_CREATED', {
      fullName: client.fullName,
      email: client.email,
      caseCode: newCase.case_code || `CASO-${newCase.id}`,
      serviceSlug: 'pclo-dictamen',
      stage: newCase.stage || 'Evaluación Inicial',
      status: newCase.status || 'En Proceso',
      caseId: newCase.id,
      clientId: client.id,
    });

    if (petition.documents && petition.documents.length > 0) {
      for (const doc of petition.documents) {
        await caseRepository.addDocument({
          caseId: newCase.id,
          name: doc.name || 'Documento Preliminar',
          type: 'recibido',
          description: 'Documento aportado en la Solicitud de Revisión Preliminar sin costo.',
          filePath: '',
          storageKey: doc.storageKey || '',
          mimeType: doc.mimeType || '',
          fileSize: doc.size || null,
          uploadedByName: req.user.fullName || 'Administración',
          visibleToClient: true,
          status: 'ready',
        });
      }
    }

    await caseReviewRepository.updateStatus(petition.id, 'converted', `Convertido a Expediente Caso #${newCase.id} (Cliente: ${client.fullName}) por ${req.user.fullName}`);

    return res.json({
      success: true,
      message: `Solicitud de revisión convertida exitosamente en el Expediente de Caso #${newCase.id}`,
      data: {
        caseId: newCase.id,
        clientId: client.id,
        clientName: client.fullName,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function downloadDocument(req, res, next) {
  try {
    const { id, docIndex } = req.params;
    const petition = await caseReviewRepository.findById(parseInt(id, 10));

    if (!petition) {
      return res.status(404).json({
        success: false,
        error: { message: 'Solicitud de revisión no encontrada.', status: 404 },
      });
    }

    const idx = parseInt(docIndex, 10);
    const doc = petition.documents && petition.documents[idx];

    if (!doc) {
      return res.status(404).json({
        success: false,
        error: { message: 'Documento no encontrado.', status: 404 },
      });
    }

    const filename = doc.name || `documento_${idx + 1}.pdf`;
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
    res.setHeader('Content-Type', doc.mimeType || 'application/octet-stream');
    res.setHeader('X-Content-Type-Options', 'nosniff');

    if (doc.storageKey) {
      const stream = await storageService.getFileStream(doc.storageKey);
      return stream.pipe(res);
    }

    if (doc.filePath) {
      const absolutePath = resolveLegacyUploadPath(doc.filePath);
      if (absolutePath && fs.existsSync(absolutePath)) {
        return res.sendFile(absolutePath);
      }
    }

    return res.status(404).json({
      success: false,
      error: { message: 'El archivo físico no se encuentra disponible en el servidor.', status: 404 },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createRequest,
  getRequests,
  updateRequestStatus,
  convertToCase,
  downloadDocument,
};
