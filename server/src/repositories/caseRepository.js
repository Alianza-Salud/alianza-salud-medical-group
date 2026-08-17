const { pool } = require('../database/db');
const { generateCaseCode } = require('../utils/codeGenerator');
const clientRepository = require('./clientRepository');

/**
 * Repositorio de Casos y Movimientos.
 * Vincula casos con `client_id` y `lawyer_id` de los Maestros.
 */
class CaseRepository {
  /**
   * Crear un nuevo caso asociándolo a un cliente existente.
   */
  async createCase({
    clientId,
    serviceSlug,
    title,
    description,
    lawyerId = null,
    assignedLawyerName = 'Equipo Jurídico Alianza Salud',
  }) {
    if (!pool) return null;

    const client = await clientRepository.findById(clientId);
    if (!client) {
      throw new Error('Cliente no encontrado en el Maestro de Clientes.');
    }

    const [countRows] = await pool.query('SELECT COUNT(*) AS total FROM cases');
    const seq = (countRows[0]?.total || 0) + 1;
    const caseCode = generateCaseCode(seq);

    const [result] = await pool.query(
      `INSERT INTO cases 
       (case_code, verification_code, client_id, client_name, client_email, client_phone, service_slug, title, description, status, stage, assigned_lawyer_name, lawyer_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'Evaluación Inicial', ?, ?)`,
      [
        caseCode,
        client.verificationCode,
        client.id,
        client.fullName,
        client.email,
        client.phone,
        serviceSlug,
        title,
        description,
        assignedLawyerName,
        lawyerId,
      ]
    );

    const caseId = result.insertId;

    // Crear primera novedad automática de apertura
    await this.addUpdate({
      caseId,
      createdByName: assignedLawyerName,
      title: 'Apertura de Caso',
      description: 'El caso ha sido registrado y vinculado al cliente en la plataforma.',
      stageName: 'Evaluación Inicial',
    });

    return this.findById(caseId);
  }

  /**
   * Buscar caso por ID con todas sus novedades.
   */
  async findById(caseId) {
    if (!pool) return null;
    const [caseRows] = await pool.query('SELECT * FROM cases WHERE id = ? LIMIT 1', [caseId]);
    if (caseRows.length === 0) return null;

    const caseData = caseRows[0];

    const [updatesRows] = await pool.query(
      'SELECT * FROM case_updates WHERE case_id = ? ORDER BY created_at DESC',
      [caseId]
    );

    const [documentsRows] = await pool.query(
      'SELECT * FROM documents WHERE case_id = ? ORDER BY created_at DESC',
      [caseId]
    );

    return {
      id: caseData.id,
      caseCode: caseData.case_code,
      verificationCode: caseData.verification_code,
      clientId: caseData.client_id,
      clientName: caseData.client_name,
      clientEmail: caseData.client_email,
      clientPhone: caseData.client_phone,
      userId: caseData.user_id,
      serviceSlug: caseData.service_slug,
      title: caseData.title,
      description: caseData.description,
      status: caseData.status,
      stage: caseData.stage,
      assignedLawyerName: caseData.assigned_lawyer_name,
      lawyerId: caseData.lawyer_id,
      createdAt: caseData.created_at,
      updates: updatesRows.map((u) => ({
        id: u.id,
        createdByName: u.created_by_name,
        title: u.title,
        description: u.description,
        stageName: u.stage_name,
        createdAt: u.created_at,
      })),
      documents: documentsRows.map((d) => ({
        id: d.id,
        caseId: d.case_id,
        name: d.name,
        type: d.type,
        description: d.description,
        filePath: d.file_path,
        originalName: d.original_name,
        uploadedByName: d.uploaded_by_name,
        status: d.status,
        visibleToClient: Boolean(d.visible_to_client),
        createdAt: d.created_at,
      })),
    };
  }

  /**
   * Buscar documentos de un caso.
   */
  async findDocumentsByCaseId(caseId, isClientOnly = false) {
    if (!pool) return [];
    let query = 'SELECT * FROM documents WHERE case_id = ?';
    if (isClientOnly) query += ' AND visible_to_client = 1';
    query += ' ORDER BY created_at DESC';
    const [rows] = await pool.query(query, [caseId]);
    return rows.map((d) => ({
      id: d.id,
      caseId: d.case_id,
      name: d.name,
      type: d.type,
      description: d.description,
      filePath: d.file_path,
      originalName: d.original_name,
      uploadedByName: d.uploaded_by_name,
      status: d.status,
      visibleToClient: Boolean(d.visible_to_client),
      createdAt: d.created_at,
    }));
  }

  /**
   * Agregar un documento a un caso.
   */
  async addDocument({
    caseId,
    name,
    type = 'recibido',
    description = '',
    filePath = '',
    originalName = '',
    uploadedByName = 'Administración',
    visibleToClient = false,
  }) {
    if (!pool) return null;
    const [result] = await pool.query(
      `INSERT INTO documents (case_id, name, type, description, file_path, original_name, uploaded_by_name, visible_to_client)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [caseId, name, type, description, filePath, originalName, uploadedByName, visibleToClient ? 1 : 0]
    );

    return {
      id: result.insertId,
      caseId,
      name,
      type,
      description,
      filePath,
      originalName,
      uploadedByName,
      visibleToClient: Boolean(visibleToClient),
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Obtener todos los casos.
   */
  async findAll() {
    if (!pool) return [];
    const [rows] = await pool.query('SELECT * FROM cases ORDER BY created_at DESC');
    return rows.map((r) => ({
      id: r.id,
      caseCode: r.case_code,
      verificationCode: r.verification_code,
      clientId: r.client_id,
      clientName: r.client_name,
      clientEmail: r.client_email,
      clientPhone: r.client_phone,
      userId: r.user_id,
      serviceSlug: r.service_slug,
      title: r.title,
      description: r.description,
      status: r.status,
      stage: r.stage,
      assignedLawyerName: r.assigned_lawyer_name,
      lawyerId: r.lawyer_id,
      createdAt: r.created_at,
    }));
  }

  /**
   * Obtener casos de un cliente por userId o clientEmail.
   */
  async findByClientUser(userId, email) {
    if (!pool) return [];
    const [rows] = await pool.query(
      'SELECT * FROM cases WHERE user_id = ? OR client_email = ? ORDER BY created_at DESC',
      [userId, email]
    );
    const fullCases = await Promise.all(rows.map((r) => this.findById(r.id)));
    return fullCases.filter(Boolean);
  }

  /**
   * Obtener casos asignados a un Abogado/Especialista.
   */
  async findByLawyer(lawyerId, lawyerName = '', lawyerEmail = '') {
    if (!pool) return [];
    const [rows] = await pool.query(
      `SELECT * FROM cases 
       WHERE lawyer_id = ? OR assigned_lawyer_name = ? OR (client_email = ? AND user_id IS NULL)
       ORDER BY created_at DESC`,
      [lawyerId || 0, lawyerName, lawyerEmail]
    );
    const fullCases = await Promise.all(rows.map((r) => this.findById(r.id)));
    return fullCases.filter(Boolean);
  }

  /**
   * Cambiar o avanzar la etapa del caso.
   */
  async updateStage(caseId, stageName, status = 'in_progress') {
    if (!pool) return false;
    await pool.query('UPDATE cases SET stage = ?, status = ? WHERE id = ?', [stageName, status, caseId]);
    return true;
  }

  /**
   * Agregar novedad / movimiento a un caso.
   */
  async addUpdate({ caseId, createdByName, title, description, stageName, updateStageStatus = true }) {
    if (!pool) return null;

    if (stageName && updateStageStatus) {
      await this.updateStage(caseId, stageName, 'in_progress');
    }

    const [result] = await pool.query(
      `INSERT INTO case_updates (case_id, created_by_name, title, description, stage_name)
       VALUES (?, ?, ?, ?, ?)`,
      [caseId, createdByName, title, description, stageName || 'Actualización']
    );

    return {
      id: result.insertId,
      caseId,
      createdByName,
      title,
      description,
      stageName,
      createdAt: new Date().toISOString(),
    };
  }
}

module.exports = new CaseRepository();
