const { pool } = require('../database/db');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { recordAuditEvent } = require('../services/auditService');

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

const clientRepository = require('../repositories/clientRepository');
const lawyerRepository = require('../repositories/lawyerRepository');

async function createUser(req, res, next) {
  try {
    const { fullName, email, password, role = 'client', phone = '', clientId, lawyerId } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, error: { message: 'Nombre, correo y contraseña son obligatorios.', status: 400 } });
    }
    if (String(password).length < 12 || String(password).length > 128) {
      return res.status(400).json({ success: false, error: { message: 'La contraseña debe tener entre 12 y 128 caracteres.', status: 400 } });
    }

    // Verificar si el correo electrónico ya existe en usuarios
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ? LIMIT 1', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, error: { message: 'El correo electrónico ya está registrado en la plataforma.', status: 400 } });
    }

    // Si se crea cuenta para un Cliente del Maestro
    if (role === 'client' && clientId) {
      const client = await clientRepository.findById(parseInt(clientId, 10));
      if (!client) {
        return res.status(404).json({ success: false, error: { message: 'Cliente no encontrado en el Maestro.', status: 404 } });
      }
      if (client.userId) {
        return res.status(400).json({ success: false, error: { message: 'El cliente seleccionado ya cuenta con un usuario registrado.', status: 400 } });
      }
    }

    // Si se crea cuenta para un Especialista del Maestro
    if (role === 'lawyer' && lawyerId) {
      const lawyer = await lawyerRepository.findById(parseInt(lawyerId, 10));
      if (!lawyer) {
        return res.status(404).json({ success: false, error: { message: 'Especialista no encontrado en el Maestro.', status: 404 } });
      }
      if (lawyer.userId) {
        return res.status(400).json({ success: false, error: { message: 'El especialista seleccionado ya cuenta con un usuario registrado.', status: 400 } });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const [result] = await pool.query(
      'INSERT INTO users (full_name, email, password_hash, role, phone, is_active) VALUES (?, ?, ?, ?, ?, 1)',
      [fullName, email, passwordHash, role, phone]
    );

    const newUserId = result.insertId;
    void recordAuditEvent(req, { event: 'USER_CREATED', resourceType: 'user', resourceId: newUserId });

    if (role === 'client' && clientId) {
      await clientRepository.linkUserId(parseInt(clientId, 10), newUserId);
    }

    if (role === 'lawyer' && lawyerId) {
      await lawyerRepository.linkUserId(parseInt(lawyerId, 10), newUserId);
    }

    return res.status(201).json({
      success: true,
      message: 'Usuario creado y vinculado exitosamente al Maestro.',
      data: { id: newUserId, fullName, email, role, phone, isActive: true },
    });
  } catch (error) {
    next(error);
  }
}

async function updateUser(req, res, next) {
  try {
    const { id } = req.params;
    const { fullName, email, role, phone, isActive } = req.body;

    const [existing] = await pool.query('SELECT role, is_active FROM users WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, error: { message: 'Usuario no encontrado.', status: 404 } });
    }

    const currentRole = existing[0].role;
    const targetIsActive = isActive === true || isActive === 1 || isActive === 'true';

    // Regla de seguridad: Impedir inactivar cuentas de tipo 'admin'
    if (currentRole === 'admin' && !targetIsActive) {
      return res.status(400).json({
        success: false,
        error: { message: 'No es posible inactivar a un usuario con rol de Administrador.', status: 400 },
      });
    }

    await pool.query(
      'UPDATE users SET full_name = ?, email = ?, role = ?, phone = ?, is_active = ? WHERE id = ?',
      [fullName, email, role, phone, targetIsActive ? 1 : 0, id]
    );
    if (currentRole !== role) {
      void recordAuditEvent(req, { event: 'USER_ROLE_CHANGED', resourceType: 'user', resourceId: id });
    }
    if (Boolean(existing[0].is_active) && !targetIsActive) {
      void recordAuditEvent(req, { event: 'USER_DISABLED', resourceType: 'user', resourceId: id });
    }

    return res.json({
      success: true,
      message: `Cuenta de usuario ${targetIsActive ? 'activada' : 'inactivada'} exitosamente.`,
    });
  } catch (error) {
    next(error);
  }
}

async function resetUserPassword(req, res, next) {
  try {
    const { id } = req.params;
    const { newPassword } = req.body || {};

    const targetPassword = newPassword && String(newPassword).trim()
      ? String(newPassword).trim()
      : `Tmp-${crypto.randomBytes(12).toString('base64url')}`;

    if (targetPassword.length < 12 || targetPassword.length > 128) {
      return res.status(400).json({ success: false, error: { message: 'La contraseña debe tener entre 12 y 128 caracteres.', status: 400 } });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(targetPassword, salt);

    await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [passwordHash, id]);
    void recordAuditEvent(req, { event: 'USER_PASSWORD_RESET', resourceType: 'user', resourceId: id });

    return res.json({
      success: true,
      message: 'Contraseña restablecida exitosamente.',
      data: {
        userId: parseInt(id, 10),
        temporaryPassword: targetPassword,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getUsers,
  createUser,
  updateUser,
  resetUserPassword,
};
