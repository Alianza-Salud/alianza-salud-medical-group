const { pool } = require('../database/db');

/**
 * Repositorio de Usuarios.
 * Encargado del acceso a los datos de la tabla `users` en MySQL.
 */
class UserRepository {
  /**
   * Formatear fila de usuario para ocultar password_hash en respuestas.
   */
  _formatUser(row) {
    if (!row) return null;
    return {
      id: row.id,
      fullName: row.full_name,
      email: row.email,
      role: row.role,
      phone: row.phone || '',
      isActive: Boolean(row.is_active),
      createdAt: row.created_at,
    };
  }

  /**
   * Buscar usuario por email (incluyendo password_hash para autenticación).
   */
  async findByEmail(email) {
    if (!pool) return null;
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
    if (rows.length === 0) return null;
    return {
      user: this._formatUser(rows[0]),
      passwordHash: rows[0].password_hash,
    };
  }

  /**
   * Buscar usuario por ID.
   */
  async findById(id) {
    if (!pool) return null;
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);
    if (rows.length === 0) return null;
    return this._formatUser(rows[0]);
  }

  /**
   * Crear nuevo usuario.
   */
  async create({ fullName, email, passwordHash, role = 'client', phone = '' }) {
    if (!pool) return null;
    const [result] = await pool.query(
      `INSERT INTO users (full_name, email, password_hash, role, phone, is_active)
       VALUES (?, ?, ?, ?, ?, 1)`,
      [fullName, email, passwordHash, role, phone]
    );

    return {
      id: result.insertId,
      fullName,
      email,
      role,
      phone,
      isActive: true,
      createdAt: new Date().toISOString(),
    };
  }
}

module.exports = new UserRepository();
