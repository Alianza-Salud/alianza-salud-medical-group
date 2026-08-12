const { pool } = require('../database/db');

/**
 * Repositorio de Contacto.
 */
class ContactRepository {
  /**
   * Obtener todos los mensajes de contacto.
   */
  async findAll() {
    if (!pool) return [];
    const [rows] = await pool.query('SELECT * FROM contacts ORDER BY created_at DESC');
    return rows.map((r) => ({
      id: r.id,
      fullName: r.full_name,
      email: r.email,
      phone: r.phone,
      subject: r.subject,
      message: r.message,
      isRead: Boolean(r.is_read),
      responded: Boolean(r.responded),
      createdAt: r.created_at,
    }));
  }

  /**
   * Obtener cantidad de mensajes no leídos.
   */
  async getUnreadCount() {
    if (!pool) return 0;
    const [rows] = await pool.query('SELECT COUNT(*) AS count FROM contacts WHERE is_read = 0');
    return rows[0]?.count || 0;
  }

  /**
   * Crear un nuevo mensaje de contacto desde la web pública.
   */
  async create(contactData) {
    if (!pool) return null;
    const { fullName, email, phone, subject, message } = contactData;

    const [result] = await pool.query(
      `INSERT INTO contacts (full_name, email, phone, subject, message, is_read)
       VALUES (?, ?, ?, ?, ?, 0)`,
      [fullName, email, phone, subject, message]
    );

    return {
      id: result.insertId,
      ...contactData,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Marcar mensaje como leído / respondido.
   */
  async markAsRead(id, isRead = true) {
    if (!pool) return false;
    await pool.query('UPDATE contacts SET is_read = ? WHERE id = ?', [isRead ? 1 : 0, id]);
    return true;
  }
}

module.exports = new ContactRepository();
