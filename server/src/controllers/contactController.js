const contactRepository = require('../repositories/contactRepository');

/**
 * Recibir mensaje de contacto.
 * POST /api/contact
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
  createContactMessage,
};
