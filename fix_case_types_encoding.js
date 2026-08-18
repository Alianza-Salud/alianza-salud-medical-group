require('dotenv').config({ path: './server/.env' });
const { pool } = require('./server/src/database/db');

async function fixCaseTypes() {
  if (!pool) {
    console.error('No MySQL pool');
    process.exit(1);
  }

  const initialTypes = [
    { id: 1, name: 'Lesión por Accidente de Tránsito (SOAT)', description: 'Casos vinculados a siniestros viales y cobertura SOAT' },
    { id: 2, name: 'Enfermedad o Accidente de Trabajo / Laboral (ARL)', description: 'Casos derivados de riesgos laborales y dictámenes ARL' },
    { id: 3, name: 'Negligencia Médica o Secuela Quirúrgica', description: 'Casos por presunta mala praxis o fallas asistenciales' },
    { id: 4, name: 'Lesión por Responsabilidad Civil / Terceros', description: 'Daños corporales generados por terceros o accidentes generales' },
    { id: 5, name: 'Secuela Traumatológica / Incapacidad Permanente', description: 'Evaluaciones por incapacidad permanente parcial o total' },
    { id: 6, name: 'Valoración de Estado Secuelar / Daño Corporal', description: 'Dictámenes integrales sobre baremos de daño corporal' },
    { id: 7, name: 'Otro Tipo de Lesión / Secuela', description: 'Casos periciales con requerimientos especiales' },
  ];

  for (const t of initialTypes) {
    await pool.query(
      `INSERT INTO case_types (id, name, description, is_active)
       VALUES (?, ?, ?, 1)
       ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description), is_active = 1`,
      [t.id, t.name, t.description]
    );
  }

  console.log('✅ case_types table encoding fixed cleanly via mysql2!');
  process.exit(0);
}

fixCaseTypes().catch((err) => {
  console.error('Error fixing case_types:', err);
  process.exit(1);
});
