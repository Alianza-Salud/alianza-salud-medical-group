const { pool } = require('../database/db');
const bcrypt = require('bcryptjs');

/**
 * Controlador de Maestro de Cuentas de Usuario.
 */

async function getUsers(req, res, next) {
  try {
    if (!pool) return res.json({ success: true, data: [] });
    const [rows] = await pool.query('SELECT id, full_name, email, role, phone, is_active, created_at FROM users ORDER BY created_at DESC');
    const users = rows.map((r) => ({
      id: r.id,
      fullName: r.full_name,
      email: r.email,
      role: r.role,
      phone: r.phone || '',
      isActive: Boolean(r.is_active),
      createdAt: r.created_at,
    }));
    return res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
}

async function createUser(req, res, next) {
  try {
    const { fullName, email, password, role = 'client', phone = '' } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, error: { message: 'Nombre, correo y contraseña son obligatorios.', status: 400 } });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const [result] = await pool.query(
      'INSERT INTO users (full_name, email, password_hash, role, phone, is_active) VALUES (?, ?, ?, ?, ?, 1)',
      [fullName, email, passwordHash, role, phone]
    );

    return res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente.',
      data: { id: result.insertId, fullName, email, role, phone, isActive: true },
    });
  } catch (error) {
    next(error);
  }
}

async function updateUser(req, res, next) {
  try {
    const { id } = req.params;
    const { fullName, email, role, phone, isActive } = req.body;

    await pool.query(
      'UPDATE users SET full_name = ?, email = ?, role = ?, phone = ?, is_active = ? WHERE id = ?',
      [fullName, email, role, phone, isActive ? 1 : 0, id]
    );

    return res.json({ success: true, message: 'Usuario actualizado.' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getUsers,
  createUser,
  updateUser,
};
