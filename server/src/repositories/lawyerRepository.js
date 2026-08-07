const { pool } = require('../database/db');

/**
 * Repositorio del Maestro de Abogados y Médicos Especialistas.
 * Encargado del acceso a la tabla `lawyers` en MySQL.
 */
class LawyerRepository {
  async findAll() {
    if (!pool) return [];
    const [rows] = await pool.query('SELECT * FROM lawyers ORDER BY created_at DESC');
    return rows.map((r) => ({
      id: r.id,
      fullName: r.full_name,
      email: r.email,
      phone: r.phone || '',
      specialty: r.specialty,
      roleType: r.role_type,
      isActive: Boolean(r.is_active),
      createdAt: r.created_at,
    }));
  }

  async findById(id) {
    if (!pool) return null;
    const [rows] = await pool.query('SELECT * FROM lawyers WHERE id = ? LIMIT 1', [id]);
    if (rows.length === 0) return null;
    const r = rows[0];
    return {
      id: r.id,
      fullName: r.full_name,
      email: r.email,
      phone: r.phone || '',
      specialty: r.specialty,
      roleType: r.role_type,
      isActive: Boolean(r.is_active),
      createdAt: r.created_at,
    };
  }

  async create({ fullName, email, phone = '', specialty = 'Derecho Médico', roleType = 'lawyer' }) {
    if (!pool) return null;
    const [result] = await pool.query(
      `INSERT INTO lawyers (full_name, email, phone, specialty, role_type, is_active)
       VALUES (?, ?, ?, ?, ?, 1)`,
      [fullName, email, phone, specialty, roleType]
    );
    return this.findById(result.insertId);
  }

  async update(id, { fullName, email, phone, specialty, roleType, isActive }) {
    if (!pool) return null;
    await pool.query(
      `UPDATE lawyers SET full_name = ?, email = ?, phone = ?, specialty = ?, role_type = ?, is_active = ?
       WHERE id = ?`,
      [fullName, email, phone, specialty, roleType, isActive ? 1 : 0, id]
    );
    return this.findById(id);
  }
}

module.exports = new LawyerRepository();
