const { pool } = require('./db');

async function fixEncoding() {
  if (!pool) {
    console.error('No hay conexión a MySQL.');
    process.exit(1);
  }

  console.log('=== Iniciando corrección integral de caracteres y codificación UTF-8 ===');

  const tables = [
    'appointments',
    'cases',
    'case_lawyers',
    'case_updates',
    'clients',
    'contact_messages',
    'documents',
    'lawyers',
    'services',
    'site_info',
    'users'
  ];

  // 1. Convertir todas las tablas a utf8mb4
  for (const table of tables) {
    try {
      await pool.query(`ALTER TABLE ${table} CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
      console.log(`[OK] Tabla ${table} convertida a utf8mb4_unicode_ci`);
    } catch (err) {
      console.warn(`[Warning] No se pudo convertir la tabla ${table}:`, err.message);
    }
  }

  // 2. Corregir registros en site_info
  const siteInfoUpdates = [
    { key: 'city', value: 'Medellín, Colombia' },
    { key: 'history', value: 'Alianza Salud Medical Group nació con la visión de integrar la práctica médica especializada y la consultoría jurídica en Medellín, Colombia.' },
    { key: 'mission', value: 'Brindar soluciones y asesoría jurídica integral respaldada por conceptos médicos científicos de alta calidad.' },
    { key: 'vision', value: 'Ser la organización líder en Colombia en el acompañamiento interdisciplinario en responsabilidad médica y derecho de la salud.' },
    { key: 'values', value: JSON.stringify(["Ética profesional", "Excelencia técnica", "Empatía con las víctimas", "Transparencia", "Rigor científico"]) },
    { key: 'tagline', value: 'Servicios Médicos Especializados & Peritaje' },
    { key: 'visual_resource', value: 'Espacio reservado para imagen o recurso visual institucional' },
  ];

  for (const item of siteInfoUpdates) {
    await pool.query('UPDATE site_info SET setting_value = ? WHERE setting_key = ?', [item.value, item.key]);
  }
  console.log('[OK] Registros de site_info actualizados con español UTF-8 correcto.');

  // 3. Corregir servicios en tabla services
  const pcloShort = 'Determinación médica especializada del porcentaje de pérdida de capacidad laboral y ocupacional bajo normativa colombiana.';
  const pcloDesc = 'Evaluación médico-pericial integral orientada a la determinación técnica del porcentaje de pérdida de capacidad laboral y ocupacional (PCLO). Realizada por peritos médicos cualificados con base en los baremos vigentes en Colombia, este informe sustenta procesos de invalidez, pensiones y reclamos ante aseguradoras o entidades competentes.';
  const pcloName = 'Calificación de Pérdida de Capacidad Laboral y Ocupacional (PCLO)';
  const pcloCta = 'Solicitar valoración PCLO';
  const pcloSituations = JSON.stringify([
    "Accidentes de tránsito con secuelas físicas o cognitivas",
    "Accidentes laborales y enfermedades profesionales",
    "Secuelas de negligencia o complicaciones asistenciales médicas",
    "Reclamación de pensión de invalidez o incapacidad permanente",
    "Controversias ante Juntas de Calificación de Invalidez",
    "Pérdida de capacidad en actividades ocupacionales o cotidianas"
  ]);
  const pcloSteps = JSON.stringify([
    "Solicitud de información y recepción de documentos",
    "Admisión y revisión inicial por la auxiliar de admisiones",
    "Valoración médica especializada presencial o virtual",
    "Análisis técnico-científico e historia clínica",
    "Elaboración y revisión final del dictamen de PCLO",
    "Entrega de documento resultante y asesoría jurídica complementaria"
  ]);

  await pool.query(
    `UPDATE services SET name = ?, short_description = ?, description = ?, situations = ?, process_steps = ?, cta_text = ? WHERE slug = 'pclo'`,
    [pcloName, pcloShort, pcloDesc, pcloSituations, pcloSteps, pcloCta]
  );

  const infName = 'Informe Médico Especializado de Tipo Pericial';
  const infShort = 'Dictamen médico-legal con rigor científico para sustentar reclamaciones de daño corporal, secuelas e invalidez.';
  const infDesc = 'Elaboración de informes periciales médicos fundamentados en la evidencia clínica, historia médica y análisis de nexo causal. Diseñados para servir de soporte en procesos de reclamación por accidentes de tránsito, accidentes laborales y negligencia y responsabilidad médica.';
  const infCta = 'Solicitar informe pericial';
  const infSituations = JSON.stringify([
    "Evaluación de nexo causal en presunta negligencia y responsabilidad médica",
    "Valoración de daño corporal y secuelas por siniestro vial",
    "Determinación de gravedad de lesiones sufridas en ambiente de trabajo",
    "Dictamen técnico para objeció﻿n de dictámenes de aseguradoras",
    "Segunda opinión médico-legal sobre secuelas permanentes",
    "Soporte especializado para procesos judiciales o extrajudiciales"
  ]);
  const infSteps = JSON.stringify([
    "Recepción de solicitud y antecedentes clínicos",
    "Verificación y estructuración del expediente de admisión",
    "Agendamiento y valoración médica especializada",
    "Redacción científica del informe pericial y nexo causal",
    "Carga y disponibilidad de documento resultante en plataforma",
    "Entrega al cliente y evaluación de necesidad jurídica opcional"
  ]);

  await pool.query(
    `UPDATE services SET name = ?, short_description = ?, description = ?, situations = ?, process_steps = ?, cta_text = ? WHERE slug = 'informe-pericial-medico'`,
    [infName, infShort, infDesc, infSituations, infSteps, infCta]
  );
  console.log('[OK] Registros de servicios actualizados con UTF-8 correcto.');

  // 4. Corregir caso 16 en tabla cases
  await pool.query(
    `UPDATE cases SET title = 'Dictamen PCLO por accidente en vía pública', description = 'Evaluación de pérdida de capacidad laboral tras colisión vehicular.' WHERE id = 16`
  );

  console.log('=== Corrección de codificación finalizada con éxito ===');
  process.exit(0);
}

fixEncoding().catch((err) => {
  console.error('Error al ejecutar fixEncoding:', err);
  process.exit(1);
});
