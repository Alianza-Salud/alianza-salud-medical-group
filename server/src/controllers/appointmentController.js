const appointmentRepository = require('../repositories/appointmentRepository');
const lawyerRepository = require('../repositories/lawyerRepository');
const notificationService = require('../services/notifications/notificationService');

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
 * Obtener citas en el entorno privado.
 */
async function getAppointments(req, res, next) {
  try {
    const { role, email } = req.user;
    let lawyerId = null;

    if (role === 'lawyer') {
      const lawyers = await lawyerRepository.findAll();
      const match = lawyers.find((l) => l.email.toLowerCase() === email.toLowerCase());
      if (match) {
        lawyerId = match.id;
      }
    }

    const appointments = await appointmentRepository.findAll(role === 'admin' ? null : lawyerId);

    return res.json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Actualizar estado de una cita (Aprobar, Rechazar, Cancelar).
 */
async function updateStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status, assignedLawyerId, reason } = req.body;

    if (!status && assignedLawyerId === undefined) {
      return res.status(400).json({
        success: false,
        error: { message: 'Debe especificar el nuevo estado o el profesional a asignar.', status: 400 },
      });
    }

    const existingAppointment = await appointmentRepository.findById(id);
    await appointmentRepository.updateStatus(id, status || null, assignedLawyerId || null);

    // Disparar eventos de notificación según el cambio de estado
    if (existingAppointment && status) {
      if (status === 'confirmed') {
        notificationService.emit('APPOINTMENT_CONFIRMED', {
          fullName: existingAppointment.full_name,
          email: existingAppointment.email,
          serviceType: existingAppointment.service_type,
          date: existingAppointment.preferred_date,
          time: existingAppointment.preferred_time,
          modality: 'Presencial en Sede / Remota',
        });
      } else if (status === 'cancelled') {
        notificationService.emit('APPOINTMENT_CANCELLED', {
          fullName: existingAppointment.full_name,
          email: existingAppointment.email,
          date: existingAppointment.preferred_date,
          time: existingAppointment.preferred_time,
          reason: reason || 'Cancelado por administración.',
        });
      }
    }

    return res.json({
      success: true,
      message: 'Cita actualizada exitosamente.',
    });
  } catch (error) {
    next(error);
  }
}

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

    // Disparar evento de notificación de solicitud de cita
    notificationService.emit('APPOINTMENT_REQUESTED', {
      fullName,
      email,
      phone,
      serviceType,
      preferredDate,
      preferredTime,
      message,
    });

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
  getAppointments,
  updateStatus,
  getAvailability,
  createAppointment,
};
