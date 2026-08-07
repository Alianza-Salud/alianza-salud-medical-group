require('dotenv').config();
const { pool } = require('../database/db');
const { generateCaseCode, generateVerificationCode } = require('../utils/codeGenerator');

async function seed() {
  if (!pool) {
    console.error('No MySQL pool available.');
    process.exit(1);
  }

  console.log('=== Iniciando generación de datos de prueba ===');

  // 1. Obtener Clientes existentes
  const [clients] = await pool.query('SELECT * FROM clients');
  if (clients.length === 0) {
    console.error('No existen clientes en la base de datos. Por favor asegúrese de tener clientes creados.');
    process.exit(1);
  }
  console.log(`Encontrados ${clients.length} clientes existentes.`);

  // 2. Obtener Expertos/Abogados existentes
  const [lawyers] = await pool.query('SELECT * FROM lawyers WHERE is_active = 1');
  if (lawyers.length === 0) {
    console.error('No existen abogados/expertos activos en la base de datos.');
    process.exit(1);
  }
  console.log(`Encontrados ${lawyers.length} abogados/expertos activos.`);

  // Definiciones para los 15 Casos (Estados permitidos en enum: 'pending', 'in_progress', 'closed')
  const caseStatuses = ['pending', 'in_progress', 'closed'];
  const caseStages = [
    'Evaluación Inicial',
    'Revisión de Historia Clínica',
    'Dictamen Médico Legista',
    'Auditoría y Peritaje',
    'Negociación Directa',
    'Vía Judicial',
    'Fase Final',
  ];
  const serviceSlugs = [
    'responsabilidad-medica',
    'accidentes-transito',
    'indemnizaciones',
    'peritaje-medico',
    'auditoria-salud',
    'medicina-forense',
  ];

  const caseTitles = [
    'Caso por presunta negligencia quirúrgica abdominal',
    'Reclamación de indemnización por accidente de tránsito en vía principal',
    'Peritaje médico especializado en ortopedia y traumatología',
    'Evaluación de daño corporal por accidente laboral grave',
    'Auditoría médica por falla en diagnóstico oncológico tardío',
    'Defensa jurídica en caso de responsabilidad hospitalaria',
    'Reclamación por secuelas estéticas y funcionales tras cirugía',
    'Valoración médica de secuelas neurológicas postraumáticas',
    'Demanda por falla en prestación de servicio asistencial de urgencias',
    'Conciliación prejudicial por siniestro vial con lesiones personales',
    'Dictamen forense especializado en secuelas estéticas faciales',
    'Asesoría y acompañamiento en derecho médico asistencial',
    'Peritaje en anestesiología por complicaciones quirúrgicas',
    'Reclamación directa a aseguradora por SOAT e invalidez',
    'Evaluación de incapacidad permanente por secuelas traumatológicas',
  ];

  // Insertar 15 casos
  const [countRows] = await pool.query('SELECT COUNT(*) AS total FROM cases');
  let startSeq = (countRows[0]?.total || 0) + 1;

  for (let i = 0; i < 15; i++) {
    const client = clients[i % clients.length];
    const lawyer = lawyers[i % lawyers.length];
    const status = caseStatuses[i % caseStatuses.length];
    const stage = caseStages[i % caseStages.length];
    const serviceSlug = serviceSlugs[i % serviceSlugs.length];
    const title = caseTitles[i];
    const description = `Descripción detallada para ${title}. Proceso supervisado por ${lawyer.full_name}.`;
    const caseCode = generateCaseCode(startSeq + i);
    const verificationCode = generateVerificationCode();

    const [res] = await pool.query(
      `INSERT INTO cases 
       (case_code, verification_code, client_id, client_name, client_email, client_phone, service_slug, title, description, status, stage, assigned_lawyer_name, lawyer_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        caseCode,
        verificationCode,
        client.id,
        client.full_name,
        client.email,
        client.phone || '3000000000',
        serviceSlug,
        title,
        description,
        status,
        stage,
        lawyer.full_name,
        lawyer.id,
      ]
    );

    const caseId = res.insertId;

    // Crear 2 novedades por caso
    await pool.query(
      `INSERT INTO case_updates (case_id, created_by_name, title, description, stage_name)
       VALUES (?, ?, ?, ?, ?)`,
      [
        caseId,
        lawyer.full_name,
        'Apertura e Ingreso de Expediente',
        `Caso aperturado formalmente y asignado a ${lawyer.full_name}.`,
        'Evaluación Inicial',
      ]
    );

    await pool.query(
      `INSERT INTO case_updates (case_id, created_by_name, title, description, stage_name)
       VALUES (?, ?, ?, ?, ?)`,
      [
        caseId,
        lawyer.full_name,
        `Avance de Etapa: ${stage}`,
        `Se ha avanzado en la revisión de pruebas documentales y técnicas del expediente. Estado actual: ${status}.`,
        stage,
      ]
    );
  }

  console.log('✅ 15 casos creados correctamente en la tabla `cases` con sus novedades.');

  // 3. Crear 10 Citas en estado "approved" con fecha "2026-08-08" y experto asignado
  const timeSlots = [
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '08:30',
    '10:30',
  ];

  const appointmentServices = [
    'Consultoría Jurídica Médica',
    'Valoración por Perito Médico',
    'Evaluación por Negligencia Médica',
    'Accidentes de Tránsito SOAT',
    'Revisión de Historia Clínica',
    'Dictamen de Incapacidad',
    'Asesoría en Seguro de Salud',
    'Segunda Opinión Médico Legal',
    'Conciliación de Lesiones',
    'Peritaje en Daño Corporal',
  ];

  for (let i = 0; i < 10; i++) {
    const client = clients[i % clients.length];
    const lawyer = lawyers[i % lawyers.length];
    const time = timeSlots[i];
    const serviceType = appointmentServices[i];

    await pool.query(
      `INSERT INTO appointments 
       (full_name, email, phone, service_type, preferred_date, preferred_time, message, status, assigned_lawyer_id)
       VALUES (?, ?, ?, ?, '2026-08-08', ?, ?, 'approved', ?)`,
      [
        client.full_name,
        client.email,
        client.phone || '3000000000',
        serviceType,
        time,
        `Cita de evaluación agendada para el 08/08/2026 a las ${time} con el especialista ${lawyer.full_name}.`,
        lawyer.id,
      ]
    );
  }

  console.log('✅ 10 citas en estado APROBADO creadas correctamente para la fecha 2026-08-08 con experto asignado.');
  console.log('=== Generación completada con éxito ===');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Error al ejecutar seed:', err);
  process.exit(1);
});
