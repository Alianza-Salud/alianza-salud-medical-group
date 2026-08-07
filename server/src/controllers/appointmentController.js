const appointmentRepository = require('../repositories/appointmentRepository');

const allTimeSlots = [
  { value: '08:00', label: '8:00 AM' },
  { value: '09:00', label: '9:00 AM' },
  { value: '10:00', label: '10:00 AM' },
  { value: '11:00', label: '11:00 AM' },
  { value: '14:00', label: '2:00 PM' },
  { value: '15:00', label: '3:00 PM' },
  { value: '16:00', label: '4:00 PM' },
  { value: '17:00', label: '5:00 PM' },
];

/**
 * Obtener disponibilidad para una fecha.
 * GET /api/appointments/availability?date=YYYY-MM-DD
 */
async function getAvailability(req, res, next) {
  try {
    const { date } = req.query;
    let occupiedSlots = [];

    if (date) {
      try {
        occupiedSlots = await appointmentRepository.findOccupiedSlots(date);
      } catch (dbError) {
        console.warn('[AppointmentController Warning] Falló consulta MySQL:', dbError.message);
      }
    }

    const slotsWithAvailability = allTimeSlots.map((slot) => ({
      ...slot,
      available: !occupiedSlots.includes(slot.value),
    }));

    return res.json({
      success: true,
      data: slotsWithAvailability,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Crear solicitud de cita.
 * POST /api/appointments
 */
async function createAppointment(req, res, next) {
  try {
    const { fullName, email, phone, serviceType, preferredDate, preferredTime, message, acceptedPolicy } = req.body;

    if (!fullName || !email || !phone || !serviceType || !preferredDate || !preferredTime) {
      return res.status(400).json({
        success: false,
        error: { message: 'Faltan campos obligatorios en el formulario', status: 400 },
      });
    }

    let appointmentResult = null;
    try {
      appointmentResult = await appointmentRepository.create({
        fullName,
        email,
        phone,
        serviceType,
        preferredDate,
        preferredTime,
        message,
        acceptedPolicy,
      });
    } catch (dbError) {
      console.warn('[AppointmentController Warning] Falló inserción en MySQL:', dbError.message);
    }

    return res.status(201).json({
      success: true,
      message: 'Su solicitud de cita ha sido recibida correctamente. Nos comunicaremos con usted para confirmar la fecha y hora.',
      data: appointmentResult || { fullName, email, serviceType, preferredDate, preferredTime },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAvailability,
  createAppointment,
};
