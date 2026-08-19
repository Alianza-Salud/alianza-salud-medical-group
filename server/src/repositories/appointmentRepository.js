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
      SELECT a.id, a.full_name, a.email, a.phone, a.service_type, 
             DATE_FORMAT(a.preferred_date, '%Y-%m-%d') AS preferred_date, 
             a.preferred_time, a.message, a.status, a.assigned_lawyer_id, a.created_at,
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
      preferredDate: r.preferred_date,
      preferredTime: r.preferred_time,
      message: r.message || '',
      status: r.status,
      assignedLawyerId: r.assigned_lawyer_id,
      assignedLawyerName: r.lawyer_name || '',
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
        `SELECT a.id, a.full_name, a.email, a.phone, a.service_type, 
                DATE_FORMAT(a.preferred_date, '%Y-%m-%d') AS preferred_date, 
                a.preferred_time, a.message, a.status, a.assigned_lawyer_id, a.created_at,
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
        preferred_date: r.preferred_date,
        preferredDate: r.preferred_date,
        preferred_time: r.preferred_time,
        preferredTime: r.preferred_time,
        message: r.message || '',
        status: r.status,
        assignedLawyerId: r.assigned_lawyer_id,
        assignedLawyerName: r.lawyer_name || '',
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
   * Crear una nueva solicitud de cita desde el sitio público.
   */
  async create(appointmentData) {
    if (!pool) return null;
    const {
      fullName,
      email,
      phone,
      serviceType,
      preferredDate,
      preferredTime,
      message = '',
      acceptedPolicy = true,
    } = appointmentData;

    const [result] = await pool.query(
      `INSERT INTO appointments 
       (full_name, email, phone, service_type, preferred_date, preferred_time, message, accepted_policy, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        fullName,
        email,
        phone,
        serviceType,
        preferredDate,
        preferredTime,
        message,
        acceptedPolicy ? 1 : 0,
      ]
    );

    return {
      id: result.insertId,
      ...appointmentData,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Actualizar estado y abogado asignado a una cita (Aprobar, Rechazar, Caso Creado).
   */
  async updateStatus(id, status = null, assignedLawyerId = null) {
    if (!pool) return false;
    if (status && assignedLawyerId !== null) {
      await pool.query('UPDATE appointments SET status = ?, assigned_lawyer_id = ? WHERE id = ?', [status, assignedLawyerId, id]);
    } else if (status) {
      await pool.query('UPDATE appointments SET status = ? WHERE id = ?', [status, id]);
    } else if (assignedLawyerId !== null) {
      await pool.query('UPDATE appointments SET assigned_lawyer_id = ? WHERE id = ?', [assignedLawyerId, id]);
    }
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
