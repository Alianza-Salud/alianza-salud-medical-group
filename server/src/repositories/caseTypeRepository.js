const { pool } = require('../database/db');

class CaseTypeRepository {
  async findAll() {
    if (!pool) return [];
    const [rows] = await pool.query('SELECT * FROM case_types ORDER BY id ASC');
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      isActive: Boolean(r.is_active),
      createdAt: r.created_at,
    }));
  }

  async findActive() {
    if (!pool) return [];
    const [rows] = await pool.query('SELECT * FROM case_types WHERE is_active = 1 ORDER BY id ASC');
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      isActive: Boolean(r.is_active),
      createdAt: r.created_at,
    }));
  }

  async findById(id) {
    if (!pool) return null;
    const [rows] = await pool.query('SELECT * FROM case_types WHERE id = ? LIMIT 1', [id]);
    if (rows.length === 0) return null;
    const r = rows[0];
    return {
      id: r.id,
      name: r.name,
      description: r.description,
      isActive: Boolean(r.is_active),
      createdAt: r.created_at,
    };
  }

  async create({ name, description = '' }) {
    if (!pool) return null;
    const [result] = await pool.query(
      'INSERT INTO case_types (name, description, is_active) VALUES (?, ?, 1)',
      [name, description]
    );
    return this.findById(result.insertId);
  }

  async update(id, { name, description, isActive }) {
    if (!pool) return null;
    await pool.query(
      'UPDATE case_types SET name = ?, description = ?, is_active = ? WHERE id = ?',
      [name, description, isActive ? 1 : 0, id]
    );
    return this.findById(id);
  }

  async delete(id) {
    if (!pool) return false;
    await pool.query('DELETE FROM case_types WHERE id = ?', [id]);
    return true;
  }
}

module.exports = new CaseTypeRepository();
