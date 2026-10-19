const { pool } = require('../database/db');
const { generateVerificationCode, hashVerificationCode } = require('../utils/codeGenerator');
const config = require('../config');

/**
 * Repositorio del Maestro de Clientes.
 * Encargado del acceso a la tabla `clients` en MySQL.
 * El Código de Verificación de 8 Caracteres se asigna ÚNICAMENTE al crear el cliente.
 */
class ClientRepository {
  /**
   * Obtener todos los clientes.
   */
  async findAll() {
    if (!pool) return [];
    const [rows] = await pool.query(
      `SELECT c.*, u.is_active AS user_active, u.created_at AS registered_at
       FROM clients c
       LEFT JOIN users u ON c.user_id = u.id
       ORDER BY c.created_at DESC`
    );
    return rows.map((r) => ({
      id: r.id,
      fullName: r.full_name,
      email: r.email,
      phone: r.phone || '',
      documentId: r.document_id || '',
      address: r.address || '',
      verificationCode: r.verification_code || '',
      userId: r.user_id,
      isRegistered: Boolean(r.user_id),
      createdAt: r.created_at,
    }));
  }

  /**
   * Buscar cliente por ID.
   */
  async findById(id) {
    if (!pool) return null;
    const [rows] = await pool.query('SELECT * FROM clients WHERE id = ? LIMIT 1', [id]);
    if (rows.length === 0) return null;
    const r = rows[0];
    return {
      id: r.id,
      fullName: r.full_name,
      email: r.email,
      phone: r.phone || '',
      documentId: r.document_id || '',
      address: r.address || '',
      verificationCode: r.verification_code || '',
      userId: r.user_id,
      isRegistered: Boolean(r.user_id),
      createdAt: r.created_at,
    };
  }

  /**
   * Buscar cliente por correo electrónico.
   */
  async findByEmail(email) {
    if (!pool) return null;
    const [rows] = await pool.query('SELECT * FROM clients WHERE email = ? LIMIT 1', [email]);
    if (rows.length === 0) return null;
    return this.findById(rows[0].id);
  }

  /**
   * Buscar cliente por Código de Verificación de 8 caracteres.
   */
  async findByVerificationCode(code) {
    if (!pool) return null;
    const cleanCode = String(code).trim().toUpperCase();
    const codeHash = hashVerificationCode(cleanCode, config.verificationCodePepper);
    const [rows] = await pool.query(
      `SELECT * FROM clients
       WHERE (verification_code_hash = ? OR verification_code = ?)
         AND verification_code_used_at IS NULL
         AND (verification_code_expires_at IS NULL OR verification_code_expires_at > NOW())
         AND verification_attempts < 5
       LIMIT 1`,
      [codeHash, cleanCode]
    );
    if (rows.length === 0) return null;
    return rows[0];
  }

  /**
   * Crear nuevo cliente (Genera Código de Verificación de 8 caracteres una sola vez).
   */
  async create({ fullName, email, phone = '', documentId = '', address = '' }) {
    if (!pool) return null;

    // Generar código de verificación único de 8 caracteres
    let verificationCode = generateVerificationCode(8);
    let attempts = 0;
    while (attempts < 5) {
      const verificationHash = hashVerificationCode(verificationCode, config.verificationCodePepper);
      const [existing] = await pool.query('SELECT id FROM clients WHERE verification_code_hash = ?', [verificationHash]);
      if (existing.length === 0) break;
      verificationCode = generateVerificationCode(8);
      attempts++;
    }

    const verificationHash = hashVerificationCode(verificationCode, config.verificationCodePepper);
    const [result] = await pool.query(
      `INSERT INTO clients
       (full_name, email, phone, document_id, address, verification_code, verification_code_hash, verification_code_expires_at)
       VALUES (?, ?, ?, ?, ?, NULL, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))`,
      [fullName, email, phone, documentId, address, verificationHash]
    );

    const created = await this.findById(result.insertId);
    return { ...created, verificationCode };
  }

  /**
   * Actualizar datos del cliente.
   */
  async update(id, { fullName, email, phone, documentId, address }) {
    if (!pool) return null;
    await pool.query(
      `UPDATE clients SET full_name = ?, email = ?, phone = ?, document_id = ?, address = ?
       WHERE id = ?`,
      [fullName, email, phone, documentId, address, id]
    );
    return this.findById(id);
  }

  /**
   * Vincular cliente con user_id cuando este activa su cuenta en /register.
   */
  async linkUserId(clientId, userId) {
    if (!pool) return false;
    await pool.query('UPDATE clients SET user_id = ? WHERE id = ?', [userId, clientId]);
    return true;
  }

  async registerAccount({ verificationCode, email, passwordHash }) {
    if (!pool) throw new Error('Base de datos no disponible.');
    const cleanCode = String(verificationCode).trim().toUpperCase();
    const codeHash = hashVerificationCode(cleanCode, config.verificationCodePepper);
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const [clients] = await connection.query(
        `SELECT * FROM clients
         WHERE verification_code_hash = ? OR verification_code = ?
         LIMIT 1 FOR UPDATE`,
        [codeHash, cleanCode]
      );
      const client = clients[0];
      const expired = client && client.verification_code_expires_at
        && new Date(client.verification_code_expires_at).getTime() <= Date.now();
      const unavailable = !client || client.user_id || client.verification_code_used_at
        || expired || Number(client.verification_attempts || 0) >= 5;
      if (unavailable) {
        if (client && !client.user_id && !client.verification_code_used_at) {
          await connection.query('UPDATE clients SET verification_attempts = verification_attempts + 1 WHERE id = ?', [client.id]);
        }
        await connection.commit();
        return { error: 'INVALID_CODE' };
      }

      const [existingUsers] = await connection.query('SELECT id FROM users WHERE email = ? LIMIT 1 FOR UPDATE', [email]);
      if (existingUsers.length > 0) {
        await connection.rollback();
        return { error: 'EMAIL_EXISTS' };
      }

      const [result] = await connection.query(
        `INSERT INTO users (full_name, email, password_hash, role, phone, is_active)
         VALUES (?, ?, ?, 'client', ?, 1)`,
        [client.full_name, email, passwordHash, client.phone || '']
      );
      const userId = result.insertId;
      await connection.query(
        `UPDATE clients SET user_id = ?, verification_code_used_at = NOW(),
         verification_attempts = verification_attempts + 1 WHERE id = ?`,
        [userId, client.id]
      );
      await connection.query(
        'UPDATE cases SET user_id = ? WHERE client_id = ? OR verification_code = ?',
        [userId, client.id, cleanCode]
      );
      await connection.commit();
      return { user: {
        id: userId,
        fullName: client.full_name,
        email,
        role: 'client',
        phone: client.phone || '',
        isActive: true,
        createdAt: new Date().toISOString(),
      } };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = new ClientRepository();
