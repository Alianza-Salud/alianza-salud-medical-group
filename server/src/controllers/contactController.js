const contactRepository = require('../repositories/contactRepository');
const notificationService = require('../services/notifications/notificationService');

/**
 * Obtener todos los mensajes de contacto (Solo Admin / Lawyer).
 */
async function getMessages(req, res, next) {
  try {
    const messages = await contactRepository.findAll();
    return res.json({
      success: true,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Marcar mensaje como leído.
 */
async function markAsRead(req, res, next) {
  try {
    const { id } = req.params;
    await contactRepository.markAsRead(id, true);
    return res.json({
      success: true,
      message: 'Mensaje marcado como leído.',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Recibir mensaje de contacto público.
 */
async function createContactMessage(req, res, next) {
  try {
    const { fullName, email, phone, subject, message } = req.body;

    if (!fullName || !email || !phone || !subject || !message) {
      return res.status(400).json({
        success: false,
        error: { message: 'Faltan campos obligatorios en el formulario de contacto', status: 400 },
      });
    }

    let contactResult = null;
    try {
      contactResult = await contactRepository.create({
        fullName,
        email,
        phone,
        subject,
        message,
      });
    } catch (dbError) {
      console.warn('[ContactController Warning] Falló inserción en MySQL:', dbError.message);
    }

    // Disparar evento de notificación de mensaje de contacto
    notificationService.emit('CONTACT_SUBMITTED', {
      fullName,
      email,
      phone,
      subject,
      message,
    });

    return res.status(201).json({
      success: true,
      message: 'Su mensaje ha sido enviado correctamente. Nos comunicaremos con usted a la brevedad.',
      data: contactResult || { fullName, email, subject },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getMessages,
  markAsRead,
  createContactMessage,
};
