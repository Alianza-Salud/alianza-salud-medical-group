// Repair legacy appointment schemas without modifying existing columns or appointment rows.
// Check each column independently so interrupted DDL can be safely resumed.
const columns = [
  ['case_type', 'VARCHAR(150) NULL'],
  ['has_lawyer', "VARCHAR(50) NULL DEFAULT 'no'"],
  ['wants_legal_support', "VARCHAR(50) NULL DEFAULT 'no_especificado'"],
  ['assigned_lawyer_id', 'INT NULL'],
  ['modality', "ENUM('presencial', 'remota') NOT NULL DEFAULT 'presencial'"],
  ['meet_link', 'VARCHAR(255) NULL'],
];

async function up(connection) {
  for (const [name, definition] of columns) {
    const [existing] = await connection.query(
      `SELECT COLUMN_NAME FROM information_schema.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'appointments' AND COLUMN_NAME = ?`,
      [name]
    );
    if (existing.length === 0) {
      await connection.query(`ALTER TABLE appointments ADD COLUMN \`${name}\` ${definition}`);
    }
  }
}

module.exports = { up };
