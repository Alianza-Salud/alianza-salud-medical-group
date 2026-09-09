const { pool } = require('../database/db');

/**
 * Repositorio de Citas.
 */
class AppointmentRepository {
  /**
   * Obtener todas las citas. Si se especifica lawyerId, filtra por las asignadas a ese profesional.
   */
  async findAll(lawyerId = null) {
    if (!pool) return [];
    let query = `
      SELECT a.id, a.full_name, a.email, a.phone, a.service_type, a.case_type, a.has_lawyer, a.wants_legal_support,
             DATE_FORMAT(a.preferred_date, '%Y-%m-%d') AS preferred_date, 
             a.preferred_time, a.message, a.status, a.assigned_lawyer_id, a.modality, a.meet_link, a.created_at,
             l.full_name AS lawyer_name
      FROM appointments a
      LEFT JOIN lawyers l ON a.assigned_lawyer_id = l.id
    `;
    const params = [];

    if (lawyerId) {
      query += ' WHERE a.assigned_lawyer_id = ?';
      params.push(lawyerId);
    }

    query += ' ORDER BY a.preferred_date DESC, a.created_at DESC';

    const [rows] = await pool.query(query, params);
    return rows.map((r) => ({
      id: r.id,
      fullName: r.full_name,
      email: r.email,
      phone: r.phone,
      serviceType: r.service_type,
      caseType: r.case_type || 'No especificado',
      hasLawyer: r.has_lawyer || 'no',
      wantsLegalSupport: r.wants_legal_support || 'no_especificado',
      preferredDate: r.preferred_date,
      preferredTime: r.preferred_time,
      message: r.message || '',
      status: r.status,
      assignedLawyerId: r.assigned_lawyer_id,
      assignedLawyerName: r.lawyer_name || '',
      modality: r.modality || 'presencial',
      meetLink: r.meet_link || null,
      createdAt: r.created_at,
    }));
  }

  /**
   * Obtener una cita por su ID.
   */
  async findById(id) {
    if (!pool) return null;
    try {
      const [rows] = await pool.query(
        `SELECT a.id, a.full_name, a.email, a.phone, a.service_type, a.case_type, a.has_lawyer, a.wants_legal_support,
                DATE_FORMAT(a.preferred_date, '%Y-%m-%d') AS preferred_date, 
                a.preferred_time, a.message, a.status, a.assigned_lawyer_id, a.modality, a.meet_link, a.created_at,
                l.full_name AS lawyer_name
         FROM appointments a
         LEFT JOIN lawyers l ON a.assigned_lawyer_id = l.id
         WHERE a.id = ? LIMIT 1`,
        [id]
      );
      if (!rows || rows.length === 0) return null;
      const r = rows[0];
      return {
        id: r.id,
        full_name: r.full_name,
        fullName: r.full_name,
        email: r.email,
        phone: r.phone,
        service_type: r.service_type,
        serviceType: r.service_type,
        case_type: r.case_type,
        caseType: r.case_type || 'No especificado',
        has_lawyer: r.has_lawyer,
        hasLawyer: r.has_lawyer || 'no',
        wants_legal_support: r.wants_legal_support,
        wantsLegalSupport: r.wants_legal_support || 'no_especificado',
        preferred_date: r.preferred_date,
        preferredDate: r.preferred_date,
        preferred_time: r.preferred_time,
        preferredTime: r.preferred_time,
        message: r.message || '',
        status: r.status,
        assignedLawyerId: r.assigned_lawyer_id,
        assignedLawyerName: r.lawyer_name || '',
        modality: r.modality || 'presencial',
        meetLink: r.meet_link || null,
        meet_link: r.meet_link || null,
        createdAt: r.created_at,
      };
    } catch (error) {
      console.error('[AppointmentRepository.findById Error]:', error.message);
      return null;
    }
  }

  /**
   * Obtener cantidad de citas pendientes de aprobación.
   */
  async getPendingCount(lawyerId = null) {
    if (!pool) return 0;
    let query = "SELECT COUNT(*) AS count FROM appointments WHERE status = 'pending'";
    const params = [];
    if (lawyerId) {
      query += ' AND assigned_lawyer_id = ?';
      params.push(lawyerId);
    }
    const [rows] = await pool.query(query, params);
    return rows[0]?.count || 0;
  }

  /**
   * Crear una nueva solicitud o cita directa.
   */
  async create(appointmentData) {
    if (!pool) return null;
    const {
      fullName,
      email,
      phone,
      serviceType,
      caseType = 'No especificado',
      hasLawyer = 'no',
      wantsLegalSupport = 'no_especificado',
      preferredDate,
      preferredTime,
      message = '',
      acceptedPolicy = true,
      status = 'pending',
      assignedLawyerId = null,
      modality = 'presencial',
      meetLink = null,
    } = appointmentData;

    const [result] = await pool.query(
      `INSERT INTO appointments 
       (full_name, email, phone, service_type, case_type, has_lawyer, wants_legal_support, preferred_date, preferred_time, message, accepted_policy, status, assigned_lawyer_id, modality, meet_link)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
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
        acceptedPolicy ? 1 : 0,
        status,
        assignedLawyerId,
        modality,
        meetLink,
      ]
    );

    return {
      id: result.insertId,
      ...appointmentData,
      caseType,
      hasLawyer,
      wantsLegalSupport,
      status,
      assignedLawyerId,
      modality,
      meetLink,
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Actualizar estado, modalidad, enlace de videollamada y abogado asignado a una cita.
   */
  async updateStatus(id, { status = null, assignedLawyerId = null, modality = null, meetLink = null }) {
    if (!pool) return false;
    const updates = [];
    const values = [];

    if (status !== null && status !== undefined) {
      updates.push('status = ?');
      values.push(status);
    }
    if (assignedLawyerId !== null && assignedLawyerId !== undefined) {
      updates.push('assigned_lawyer_id = ?');
      values.push(assignedLawyerId);
    }
    if (modality !== null && modality !== undefined) {
      updates.push('modality = ?');
      values.push(modality);
    }
    if (meetLink !== null && meetLink !== undefined) {
      updates.push('meet_link = ?');
      values.push(meetLink);
    }

    if (updates.length === 0) return true;

    values.push(id);
    await pool.query(`UPDATE appointments SET ${updates.join(', ')} WHERE id = ?`, values);
    return true;
  }

  /**
   * Obtener las franjas horarias ocupadas para una fecha dada.
   */
  async findOccupiedSlots(date) {
    if (!pool) return [];
    const [rows] = await pool.query(
      `SELECT preferred_time FROM appointments 
       WHERE preferred_date = ? AND status IN ('pending', 'approved', 'case_created')`,
      [date]
    );
    return rows.map((r) => r.preferred_time);
  }
}

module.exports = new AppointmentRepository();
