const { pool } = require('../database/db');

class CaseReviewRepository {
  async ensureTable() {
    if (!pool) return;
    await pool.query(`
      CREATE TABLE IF NOT EXISTS case_review_requests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(100) NOT NULL,
        case_type VARCHAR(100) NOT NULL,
        description TEXT,
        documents JSON,
        status VARCHAR(50) DEFAULT 'pending',
        admin_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
  }

  async create(data) {
    if (!pool) return { id: Date.now(), ...data, status: 'pending', created_at: new Date() };
    await this.ensureTable();

    const { fullName, email, phone, caseType, description = '', documents = [] } = data;
    const [result] = await pool.query(
      `INSERT INTO case_review_requests (full_name, email, phone, case_type, description, documents, status) 
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [fullName, email, phone, caseType, description, JSON.stringify(documents)]
    );

    return this.findById(result.insertId);
  }

  async findAll(statusFilter = '') {
    if (!pool) return [];
    await this.ensureTable();

    let query = 'SELECT * FROM case_review_requests';
    const params = [];

    if (statusFilter && statusFilter !== 'all') {
      query += ' WHERE status = ?';
      params.push(statusFilter);
    }

    query += ' ORDER BY created_at DESC';
    const [rows] = await pool.query(query, params);

    return rows.map((r) => this.mapRow(r));
  }

  async findById(id) {
    if (!pool) return null;
    await this.ensureTable();

    const [rows] = await pool.query('SELECT * FROM case_review_requests WHERE id = ?', [id]);
    if (rows.length === 0) return null;
    return this.mapRow(rows[0]);
  }

  async updateStatus(id, status, notes = '') {
    if (!pool) return false;
    await this.ensureTable();

    await pool.query(
      'UPDATE case_review_requests SET status = ?, admin_notes = ? WHERE id = ?',
      [status, notes, id]
    );
    return true;
  }

  async countPending() {
    if (!pool) return 0;
    await this.ensureTable();

    const [rows] = await pool.query("SELECT COUNT(*) AS total FROM case_review_requests WHERE status = 'pending'");
    return rows[0]?.total || 0;
  }

  mapRow(r) {
    let docs = [];
    try {
      docs = typeof r.documents === 'string' ? JSON.parse(r.documents) : (r.documents || []);
    } catch {
      docs = [];
    }

    return {
      id: r.id,
      fullName: r.full_name,
      email: r.email,
      phone: r.phone,
      caseType: r.case_type,
      description: r.description || '',
      documents: docs,
      status: r.status || 'pending',
      adminNotes: r.admin_notes || '',
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    };
  }
}

module.exports = new CaseReviewRepository();
