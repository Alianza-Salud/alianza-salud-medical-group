require('dotenv').config();
const mysql = require('mysql2/promise');

async function migrateAppointmentsDetails() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '1234',
    database: process.env.DB_NAME || 'alianza_salud',
  });

  console.log('[Migration] Verificando campos detallados en `appointments`...');

  const [caseTypeCols] = await conn.query('SHOW COLUMNS FROM appointments LIKE "case_type"');
  if (caseTypeCols.length === 0) {
    await conn.query("ALTER TABLE appointments ADD COLUMN case_type VARCHAR(150) NULL AFTER service_type");
    console.log('[Migration] Columna `case_type` agregada.');
  }

  const [hasLawyerCols] = await conn.query('SHOW COLUMNS FROM appointments LIKE "has_lawyer"');
  if (hasLawyerCols.length === 0) {
    await conn.query("ALTER TABLE appointments ADD COLUMN has_lawyer VARCHAR(50) NULL DEFAULT 'no' AFTER case_type");
    console.log('[Migration] Columna `has_lawyer` agregada.');
  }

  const [wantsLegalCols] = await conn.query('SHOW COLUMNS FROM appointments LIKE "wants_legal_support"');
  if (wantsLegalCols.length === 0) {
    await conn.query("ALTER TABLE appointments ADD COLUMN wants_legal_support VARCHAR(50) NULL DEFAULT 'no_especificado' AFTER has_lawyer");
    console.log('[Migration] Columna `wants_legal_support` agregada.');
  }

  console.log('[Migration] Columnas de detalle para `appointments` verificadas exitosamente.');
  await conn.end();
}

migrateAppointmentsDetails().catch(console.error);
