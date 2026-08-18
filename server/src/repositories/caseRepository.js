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
  /**
   * Crear un nuevo caso asociándolo a un cliente existente y múltiples especialistas.
   */
  async ensureSchema() {
    if (!pool) return;
    try {
      const [indexes] = await pool.query("SHOW INDEX FROM cases WHERE Column_name = 'verification_code' AND Non_unique = 0");
      for (const idx of indexes) {
        if (idx.Key_name !== 'PRIMARY') {
          await pool.query(`ALTER TABLE cases DROP INDEX ${idx.Key_name}`);
        }
      }
    } catch {}
  }

  async createCase({
    clientId,
    serviceSlug,
    caseType = 'Peritaje Médico General',
    title,
    description,
    lawyerId = null,
    lawyerIds = [],
    assignedLawyerName = 'Equipo Jurídico Alianza Salud',
  }) {
    if (!pool) return null;
    await this.ensureSchema();

    const client = await clientRepository.findById(clientId);
    if (!client) {
      throw new Error('Cliente no encontrado en el Maestro de Clientes.');
    }

    const [countRows] = await pool.query('SELECT COUNT(*) AS total FROM cases');
    const seq = (countRows[0]?.total || 0) + 1;
    const caseCode = generateCaseCode(seq);

    const targetLawyerIds = Array.isArray(lawyerIds) && lawyerIds.length > 0
      ? lawyerIds
      : (lawyerId ? [lawyerId] : []);

    const [result] = await pool.query(
      `INSERT INTO cases 
       (case_code, verification_code, client_id, client_name, client_email, client_phone, service_slug, case_type, title, description, status, stage, assigned_lawyer_name, lawyer_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'Evaluación Inicial', ?, ?)`,
      [
        caseCode,
        client.verificationCode,
        client.id,
        client.fullName,
        client.email,
        client.phone,
        serviceSlug,
        caseType,
        title,
        description,
        assignedLawyerName,
        targetLawyerIds[0] || null,
      ]
    );

    const caseId = result.insertId;

    // Vincular especialistas en case_lawyers
    for (const lid of targetLawyerIds) {
      if (lid) {
        await pool.query('INSERT IGNORE INTO case_lawyers (case_id, lawyer_id) VALUES (?, ?)', [caseId, lid]);
      }
    }

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
   * Buscar caso por ID con todas sus novedades, documentos y lista de especialistas asignados.
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

    const [lawyersRows] = await pool.query(
      `SELECT l.id, l.full_name AS fullName, l.specialty, l.email, l.phone 
       FROM case_lawyers cl
       JOIN lawyers l ON l.id = cl.lawyer_id
       WHERE cl.case_id = ?`,
      [caseId]
    );

    let assignedLawyers = lawyersRows;
    let lawyerNameStr = caseData.assigned_lawyer_name;

    if (assignedLawyers.length > 0) {
      lawyerNameStr = assignedLawyers.map((l) => l.fullName).join(', ');
    }

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
      caseType: caseData.case_type || 'Peritaje Médico General',
      title: caseData.title,
      description: caseData.description,
      status: caseData.status,
      stage: caseData.stage,
      assignedLawyerName: lawyerNameStr,
      lawyerId: caseData.lawyer_id,
      assignedLawyers: assignedLawyers,
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
   * Actualizar especialistas asignados a un caso.
   */
  async updateCaseLawyers(caseId, lawyerIds = []) {
    if (!pool) return false;
    await pool.query('DELETE FROM case_lawyers WHERE case_id = ?', [caseId]);
    for (const lid of lawyerIds) {
      if (lid) {
        await pool.query('INSERT IGNORE INTO case_lawyers (case_id, lawyer_id) VALUES (?, ?)', [caseId, lid]);
      }
    }
    // Actualizar lawyer_id en la tabla cases con el primero
    const primaryId = lawyerIds[0] || null;
    await pool.query('UPDATE cases SET lawyer_id = ? WHERE id = ?', [primaryId, caseId]);
    return true;
  }

  /**
   * Buscar un documento por su ID.
   */
  async findDocumentById(docId) {
    if (!pool) return null;
    const [rows] = await pool.query('SELECT * FROM documents WHERE id = ?', [docId]);
    if (rows.length === 0) return null;
    const d = rows[0];
    return {
      id: d.id,
      caseId: d.case_id,
      name: d.name,
      type: d.type,
      description: d.description,
      filePath: d.file_path,
      storageKey: d.storage_key,
      checksum: d.checksum,
      originalName: d.original_name,
      mimeType: d.mime_type,
      fileSize: d.file_size,
      uploadedByName: d.uploaded_by_name,
      status: d.status,
      visibleToClient: Boolean(d.visible_to_client),
      createdAt: d.created_at,
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
      storageKey: d.storage_key,
      checksum: d.checksum,
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
    storageKey = '',
    checksum = '',
    originalName = '',
    mimeType = '',
    fileSize = null,
    uploadedByName = 'Administración',
    visibleToClient = false,
    status = 'ready',
  }) {
    if (!pool) return null;
    const [result] = await pool.query(
      `INSERT INTO documents (case_id, name, type, description, file_path, storage_key, checksum, original_name, mime_type, file_size, uploaded_by_name, visible_to_client, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [caseId, name, type, description, filePath, storageKey, checksum, originalName, mimeType, fileSize, uploadedByName, visibleToClient ? 1 : 0, status]
    );

    return {
      id: result.insertId,
      caseId,
      name,
      type,
      description,
      filePath,
      storageKey,
      checksum,
      originalName,
      mimeType,
      fileSize,
      uploadedByName,
      visibleToClient: Boolean(visibleToClient),
      status,
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Actualizar visibilidad de un documento para el cliente.
   */
  async updateDocumentVisibility(docId, visibleToClient) {
    if (!pool) return false;
    await pool.query('UPDATE documents SET visible_to_client = ? WHERE id = ?', [
      visibleToClient ? 1 : 0,
      docId,
    ]);
    return true;
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
