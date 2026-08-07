const { pool } = require('../database/db');

/**
 * Repositorio de Citas.
 * Encargado del acceso a los datos de la tabla `appointments` en MySQL.
 */
class AppointmentRepository {
  /**
   * Crear una nueva solicitud de cita.
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
   * Obtener las franjas horarias ocupadas para una fecha dada.
   */
  async findOccupiedSlots(date) {
    if (!pool) return [];
    const [rows] = await pool.query(
      `SELECT preferred_time FROM appointments 
       WHERE preferred_date = ? AND status IN ('pending', 'confirmed')`,
      [date]
    );
    return rows.map((r) => r.preferred_time);
  }
}

module.exports = new AppointmentRepository();
