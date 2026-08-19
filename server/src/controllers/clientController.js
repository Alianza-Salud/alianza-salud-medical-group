const clientRepository = require('../repositories/clientRepository');
const notificationService = require('../services/notifications/notificationService');

/**
 * Controlador de Maestro de Clientes.
 */

async function getClients(req, res, next) {
  try {
    const clients = await clientRepository.findAll();
    return res.json({ success: true, data: clients });
  } catch (error) {
    next(error);
  }
}

async function getClientById(req, res, next) {
  try {
    const { id } = req.params;
    const client = await clientRepository.findById(id);
    if (!client) {
      return res.status(404).json({ success: false, error: { message: 'Cliente no encontrado', status: 404 } });
    }
    return res.json({ success: true, data: client });
  } catch (error) {
    next(error);
  }
}

async function createClient(req, res, next) {
  try {
    const { fullName, email, phone, documentId, address } = req.body;

    if (!fullName || !email) {
      return res.status(400).json({
        success: false,
        error: { message: 'Nombre completo y correo electrónico son obligatorios.', status: 400 },
      });
    }

    const newClient = await clientRepository.create({ fullName, email, phone, documentId, address });

    // Disparar evento de notificación sin bloquear la respuesta
    notificationService.emit('CLIENT_CREATED', {
      fullName: newClient.full_name,
      email: newClient.email,
      clientCode: newClient.verification_code,
      clientId: newClient.id,
    });

    return res.status(201).json({
      success: true,
      message: 'Cliente registrado exitosamente. Código de verificación generado.',
      data: newClient,
    });
  } catch (error) {
    next(error);
  }
}

async function updateClient(req, res, next) {
  try {
    const { id } = req.params;
    const { fullName, email, phone, documentId, address } = req.body;

    const updated = await clientRepository.update(id, { fullName, email, phone, documentId, address });
    return res.json({
      success: true,
      message: 'Datos del cliente actualizados.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getClients,
  getClientById,
  createClient,
  updateClient,
};
