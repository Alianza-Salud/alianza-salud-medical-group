const { pool } = require('../database/db');
const { generateVerificationCode } = require('../utils/codeGenerator');

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
      verificationCode: r.verification_code,
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
      verificationCode: r.verification_code,
      userId: r.user_id,
      isRegistered: Boolean(r.user_id),
      createdAt: r.created_at,
    };
  }

  /**
   * Buscar cliente por Código de Verificación de 8 caracteres.
   */
  async findByVerificationCode(code) {
    if (!pool) return null;
    const cleanCode = String(code).trim().toUpperCase();
    const [rows] = await pool.query('SELECT * FROM clients WHERE verification_code = ? LIMIT 1', [cleanCode]);
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
      const [existing] = await pool.query('SELECT id FROM clients WHERE verification_code = ?', [verificationCode]);
      if (existing.length === 0) break;
      verificationCode = generateVerificationCode(8);
      attempts++;
    }

    const [result] = await pool.query(
      `INSERT INTO clients (full_name, email, phone, document_id, address, verification_code)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [fullName, email, phone, documentId, address, verificationCode]
    );

    return this.findById(result.insertId);
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
}

module.exports = new ClientRepository();
