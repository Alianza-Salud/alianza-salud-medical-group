const { pool } = require('../database/db');

/**
 * Repositorio de Contacto.
 * Encargado del acceso a los datos de la tabla `contacts` en MySQL.
 */
class ContactRepository {
  /**
   * Crear un nuevo mensaje de contacto.
   */
  async create(contactData) {
    if (!pool) return null;
    const { fullName, email, phone, subject, message } = contactData;

    const [result] = await pool.query(
      `INSERT INTO contacts (full_name, email, phone, subject, message)
       VALUES (?, ?, ?, ?, ?)`,
      [fullName, email, phone, subject, message]
    );

    return {
      id: result.insertId,
      ...contactData,
      createdAt: new Date().toISOString(),
    };
  }
}

module.exports = new ContactRepository();
