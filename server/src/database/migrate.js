require('dotenv').config();
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { pool } = require('./db');

async function migrate() {
  if (!pool) throw new Error('Database pool is not available');
  await pool.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
    filename VARCHAR(255) PRIMARY KEY,
    checksum CHAR(64) NOT NULL,
    applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);

  const migrationsDir = path.resolve(__dirname, '../../migrations');
  const files = fs.readdirSync(migrationsDir).filter((name) => name.endsWith('.sql')).sort();
  for (const filename of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, filename), 'utf8');
    const checksum = crypto.createHash('sha256').update(sql).digest('hex');
    const [applied] = await pool.query('SELECT checksum FROM schema_migrations WHERE filename = ?', [filename]);
    if (applied.length > 0) {
      if (applied[0].checksum !== checksum) throw new Error(`Applied migration was modified: ${filename}`);
      continue;
    }

    const statements = sql.split(';').map((statement) => statement.trim()).filter(Boolean);
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      for (const statement of statements) await connection.query(statement);
      await connection.query('INSERT INTO schema_migrations (filename, checksum) VALUES (?, ?)', [filename, checksum]);
      await connection.commit();
      console.log(`[Migration] Applied ${filename}`);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

migrate()
  .then(async () => { await pool.end(); })
  .catch(async (error) => {
    console.error(`[Migration] Failed: ${error.message}`);
    if (pool) await pool.end();
    process.exitCode = 1;
  });
