require('dotenv').config();
const mysql = require('mysql2/promise');

async function migrateAppointmentsMeet() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '1234',
    database: process.env.DB_NAME || 'alianza_salud',
  });

  console.log('[Migration] Verificando columnas de modalidad y Google Meet en `appointments`...');

  const [cols] = await conn.query('SHOW COLUMNS FROM appointments LIKE "modality"');
  if (cols.length === 0) {
    await conn.query("ALTER TABLE appointments ADD COLUMN modality ENUM('presencial', 'remota') NOT NULL DEFAULT 'presencial' AFTER status");
    console.log('[Migration] Columna `modality` agregada.');
  }

  const [meetCols] = await conn.query('SHOW COLUMNS FROM appointments LIKE "meet_link"');
  if (meetCols.length === 0) {
    await conn.query("ALTER TABLE appointments ADD COLUMN meet_link VARCHAR(255) NULL AFTER modality");
    console.log('[Migration] Columna `meet_link` agregada.');
  }

  console.log('[Migration] Estructura de `appointments` actualizada exitosamente.');
  await conn.end();
}

migrateAppointmentsMeet().catch(console.error);
