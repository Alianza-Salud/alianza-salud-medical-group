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
    const { role, id: userId } = req.user || {};
    let lawyerId = null;

    if (role === 'lawyer') {
      const match = await lawyerRepository.findByUserId(userId);
      if (match) {
        lawyerId = match.id;
      }
    }

    const isFullAccess = role === 'admin' || role === 'auxiliar_admisiones';
    const appointments = await appointmentRepository.findAll(isFullAccess ? null : lawyerId);

    return res.json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    next(error);
  }
}

const { generateMeetUrl, createGoogleMeetEvent } = require('../utils/meetGenerator');

/**
 * Actualizar estado de una cita (Aprobar, Rechazar, Cancelar).
 */
async function updateStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status, assignedLawyerId, modality, meetLink, reason } = req.body;

    if (!status && assignedLawyerId === undefined && modality === undefined) {
      return res.status(400).json({
        success: false,
        error: { message: 'Debe especificar el nuevo estado, modalidad o el profesional a asignar.', status: 400 },
      });
    }

    const existingAppointment = await appointmentRepository.findById(id);

    let finalModality = modality || (existingAppointment ? existingAppointment.modality : 'presencial');
    let manualMeetLink = (meetLink && String(meetLink).trim() !== '') ? String(meetLink).trim() : null;
    let existingMeetLink = existingAppointment ? (existingAppointment.meetLink || existingAppointment.meet_link) : null;
    
    // Si se proporcionó un enlace manual válido en esta petición, usarlo. Si no, considerar el existente si no es dummy/plantilla.
    let finalMeetLink = manualMeetLink || (existingMeetLink && !existingMeetLink.includes('/new') ? existingMeetLink : null);

    // Si la modalidad es remota y no hay un enlace real confirmado, generar mediante Google Calendar API
    if (finalModality === 'remota' && (!finalMeetLink || String(finalMeetLink).trim() === '' || finalMeetLink.includes('/new'))) {
      const preferredDate = existingAppointment?.preferred_date || existingAppointment?.preferredDate || new Date().toISOString().split('T')[0];
      const preferredTime = existingAppointment?.preferred_time || existingAppointment?.preferredTime || '09:00';
      
      let startISO = new Date().toISOString();
      let endISO = new Date(Date.now() + 45 * 60 * 1000).toISOString();
      
      try {
        const startDateObj = new Date(`${preferredDate}T${preferredTime}:00`);
        if (!isNaN(startDateObj.getTime())) {
          startISO = startDateObj.toISOString();
          endISO = new Date(startDateObj.getTime() + 45 * 60 * 1000).toISOString();
        }
      } catch (err) {
        console.warn('[AppointmentController Warning] No se pudo parsear fecha/hora de la cita:', err.message);
      }

      finalMeetLink = await createGoogleMeetEvent({
        summary: `Videoconsulta: ${existingAppointment?.service_type || existingAppointment?.serviceType || 'Alianza Salud'}`,
        description: `Consulta médica remota agendada con Alianza Salud Medical Group para ${existingAppointment?.full_name || existingAppointment?.fullName || 'Paciente'}.`,
        startDateTime: startISO,
        endDateTime: endISO,
        attendeeEmail: existingAppointment?.email,
      });
    }

    await appointmentRepository.updateStatus(id, {
      status: status || null,
      assignedLawyerId: assignedLawyerId !== undefined ? assignedLawyerId : null,
      modality: finalModality,
      meetLink: finalMeetLink,
    });

    // Disparar eventos de notificación según el cambio de estado
    if (existingAppointment && status) {
      if (status === 'confirmed' || status === 'approved') {
        notificationService.emit('APPOINTMENT_CONFIRMED', {
          fullName: existingAppointment.full_name || existingAppointment.fullName,
          email: existingAppointment.email,
          serviceType: existingAppointment.service_type || existingAppointment.serviceType,
          date: existingAppointment.preferred_date || existingAppointment.preferredDate,
          time: existingAppointment.preferred_time || existingAppointment.preferredTime,
          modality: finalModality,
          meetLink: finalMeetLink,
        });
      } else if (status === 'cancelled' || status === 'rejected') {
        notificationService.emit('APPOINTMENT_CANCELLED', {
          fullName: existingAppointment.full_name || existingAppointment.fullName,
          email: existingAppointment.email,
          date: existingAppointment.preferred_date || existingAppointment.preferredDate,
          time: existingAppointment.preferred_time || existingAppointment.preferredTime,
          reason: reason || 'Cancelado por administración.',
        });
      }
    }

    return res.json({
      success: true,
      message: 'Cita actualizada exitosamente.',
      data: {
        id,
        status: status || existingAppointment?.status,
        modality: finalModality,
        meetLink: finalMeetLink,
      },
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
    const {
      fullName,
      email,
      phone,
      serviceType,
      caseType,
      hasLawyer,
      wantsLegalSupport,
      preferredDate,
      preferredTime,
      message,
      acceptedPolicy,
    } = req.body;

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
        caseType: caseType || 'No especificado',
        hasLawyer: hasLawyer || 'no',
        wantsLegalSupport: wantsLegalSupport || 'no_especificado',
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

/**
 * Crear cita directamente desde el panel de administración (sin necesidad de solicitud pública).
 */
async function createAdminAppointment(req, res, next) {
  try {
    const {
      fullName,
      email,
      phone,
      serviceType,
      caseType,
      hasLawyer,
      wantsLegalSupport,
      preferredDate,
      preferredTime,
      message,
      status = 'approved',
      assignedLawyerId,
      modality = 'presencial',
      meetLink,
    } = req.body;

    if (!fullName || !email || !phone || !serviceType || !preferredDate || !preferredTime) {
      return res.status(400).json({
        success: false,
        error: { message: 'Faltan campos obligatorios para agendar la cita.', status: 400 },
      });
    }

    let finalMeetLink = (meetLink && String(meetLink).trim() !== '') ? String(meetLink).trim() : null;

    if (modality === 'remota' && status === 'approved' && (!finalMeetLink || finalMeetLink.includes('/new'))) {
      let startISO = new Date().toISOString();
      let endISO = new Date(Date.now() + 45 * 60 * 1000).toISOString();
      try {
        const startDateObj = new Date(`${preferredDate}T${preferredTime}:00`);
        if (!isNaN(startDateObj.getTime())) {
          startISO = startDateObj.toISOString();
          endISO = new Date(startDateObj.getTime() + 45 * 60 * 1000).toISOString();
        }
      } catch (err) {
        console.warn('[AppointmentController Warning] Error parseando fecha en creación admin:', err.message);
      }

      finalMeetLink = await createGoogleMeetEvent({
        summary: `Videoconsulta: ${serviceType}`,
        description: `Consulta médica remota agendada para ${fullName}.`,
        startDateTime: startISO,
        endDateTime: endISO,
        attendeeEmail: email,
      });
    }

    const appointmentResult = await appointmentRepository.create({
      fullName,
      email,
      phone,
      serviceType,
      caseType: caseType || 'No especificado',
      hasLawyer: hasLawyer || 'no',
      wantsLegalSupport: wantsLegalSupport || 'no_especificado',
      preferredDate,
      preferredTime,
      message: message || '',
      acceptedPolicy: true,
      status,
      assignedLawyerId: assignedLawyerId || null,
      modality,
      meetLink: finalMeetLink,
    });

    if (status === 'approved' || status === 'confirmed') {
      notificationService.emit('APPOINTMENT_CONFIRMED', {
        fullName,
        email,
        serviceType,
        date: preferredDate,
        time: preferredTime,
        modality,
        meetLink: finalMeetLink,
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Cita creada exitosamente por administración.',
      data: appointmentResult,
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
  createAdminAppointment,
};
