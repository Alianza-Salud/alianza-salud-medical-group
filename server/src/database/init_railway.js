/**
 * Script de inicialización y migración completa para Railway MySQL.
 * Crea todas las tablas, esquemas, relaciones y datos iniciales en la base de datos de Railway.
 */
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const RAILWAY_URL = 'mysql://root:HtoaihTpSOTQmCAdSzKWvzBeNzVTYQtU@iriguchi.proxy.rlwy.net:57981/railway';

async function initRailway() {
  console.log('🚀 Conectando a Railway MySQL en iriguchi.proxy.rlwy.net:57981...');

  const pool = mysql.createPool({
    uri: RAILWAY_URL,
    multipleStatements: true,
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
    charset: 'utf8mb4',
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
  });

  const connection = pool;

  console.log('✅ Conexión establecida exitosamente con Railway.');

  try {
    // 1. Tablas independientes / maestras
    console.log('📦 1. Creando tablas maestras...');

    await connection.query(`
      CREATE TABLE IF NOT EXISTS services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        slug VARCHAR(100) NOT NULL UNIQUE,
        name VARCHAR(150) NOT NULL,
        short_description VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        icon VARCHAR(50) NOT NULL DEFAULT 'Briefcase',
        situations JSON NOT NULL,
        process_steps JSON NOT NULL,
        cta_text VARCHAR(100) NOT NULL DEFAULT 'Solicitar evaluación',
        is_active TINYINT(1) NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(150) NOT NULL,
        email VARCHAR(120) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('client', 'lawyer', 'admin') NOT NULL DEFAULT 'client',
        phone VARCHAR(30) NULL,
        is_active TINYINT(1) NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS lawyers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(150) NOT NULL,
        email VARCHAR(120) NOT NULL UNIQUE,
        phone VARCHAR(30) NULL,
        specialty VARCHAR(100) NOT NULL DEFAULT 'Derecho Médico',
        role_type ENUM('lawyer', 'medical_specialist') NOT NULL DEFAULT 'lawyer',
        is_active TINYINT(1) NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS clients (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(150) NOT NULL,
        email VARCHAR(120) NOT NULL UNIQUE,
        phone VARCHAR(30) NULL,
        document_id VARCHAR(30) NULL,
        address VARCHAR(200) NULL,
        verification_code VARCHAR(8) NOT NULL UNIQUE,
        user_id INT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS case_types (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(150) NOT NULL UNIQUE,
        description TEXT NULL,
        is_active TINYINT(1) NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 2. Tablas de Casos y Expedientes
    console.log('📦 2. Creando tablas de casos y expedientes...');

    await connection.query(`
      CREATE TABLE IF NOT EXISTS cases (
        id INT AUTO_INCREMENT PRIMARY KEY,
        case_code VARCHAR(50) NOT NULL UNIQUE,
        verification_code VARCHAR(8) NOT NULL UNIQUE,
        client_id INT NULL,
        client_name VARCHAR(150) NOT NULL,
        client_email VARCHAR(120) NOT NULL,
        client_phone VARCHAR(30) NULL,
        user_id INT NULL,
        lawyer_id INT NULL,
        service_slug VARCHAR(100) NOT NULL,
        title VARCHAR(200) NOT NULL,
        description TEXT NOT NULL,
        status ENUM('pending', 'in_progress', 'closed') NOT NULL DEFAULT 'pending',
        stage VARCHAR(100) NOT NULL DEFAULT 'Evaluación Inicial',
        assigned_lawyer_name VARCHAR(150) NULL DEFAULT 'Equipo Jurídico Alianza Salud',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL,
        FOREIGN KEY (lawyer_id) REFERENCES lawyers(id) ON DELETE SET NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS case_lawyers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        case_id INT NOT NULL,
        lawyer_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE,
        FOREIGN KEY (lawyer_id) REFERENCES lawyers(id) ON DELETE CASCADE,
        UNIQUE KEY unique_case_lawyer (case_id, lawyer_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS case_updates (
        id INT AUTO_INCREMENT PRIMARY KEY,
        case_id INT NOT NULL,
        created_by_name VARCHAR(150) NOT NULL DEFAULT 'Administración',
        title VARCHAR(200) NOT NULL,
        description TEXT NOT NULL,
        stage_name VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS documents (
        id INT AUTO_INCREMENT PRIMARY KEY,
        case_id INT NOT NULL,
        name VARCHAR(200) NOT NULL,
        type VARCHAR(50) NOT NULL DEFAULT 'recibido',
        description TEXT NULL,
        file_path VARCHAR(500) NULL,
        original_name VARCHAR(255) NULL,
        mime_type VARCHAR(100) NULL,
        file_size INT NULL,
        uploaded_by_name VARCHAR(150) NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'aprobado',
        visible_to_client TINYINT(1) NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 3. Tablas de Citas, Contacto e Institucionales
    console.log('📦 3. Creando tablas de citas, contactos e info del sitio...');

    await connection.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(150) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(30) NOT NULL,
        service_type VARCHAR(100) NOT NULL,
        preferred_date DATE NOT NULL,
        preferred_time VARCHAR(10) NOT NULL,
        message TEXT NULL,
        accepted_policy TINYINT(1) NOT NULL DEFAULT 1,
        assigned_lawyer_id INT NULL,
        status ENUM('pending', 'approved', 'rejected', 'case_created', 'confirmed', 'cancelled', 'completed') NOT NULL DEFAULT 'pending',
        modality ENUM('presencial', 'remota') NOT NULL DEFAULT 'presencial',
        meet_link VARCHAR(255) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (assigned_lawyer_id) REFERENCES lawyers(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(150) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(30) NOT NULL,
        subject VARCHAR(200) NOT NULL,
        message TEXT NOT NULL,
        is_read TINYINT(1) NOT NULL DEFAULT 0,
        responded TINYINT(1) NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS site_info (
        id INT AUTO_INCREMENT PRIMARY KEY,
        setting_key VARCHAR(50) NOT NULL UNIQUE,
        setting_value TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 4. Tablas de Notificaciones
    console.log('📦 4. Creando tablas de notificaciones y auditoría...');

    await connection.query(`
      CREATE TABLE IF NOT EXISTS notification_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        event_type VARCHAR(80) NOT NULL UNIQUE,
        event_name VARCHAR(150) NOT NULL,
        category VARCHAR(80) NOT NULL DEFAULT 'general',
        send_to_client TINYINT(1) NOT NULL DEFAULT 1,
        send_to_admin TINYINT(1) NOT NULL DEFAULT 1,
        is_enabled TINYINT(1) NOT NULL DEFAULT 1,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS notification_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        event_type VARCHAR(80) NOT NULL,
        recipient_email VARCHAR(120) NOT NULL,
        recipient_type ENUM('client', 'admin') NOT NULL DEFAULT 'client',
        subject VARCHAR(200) NOT NULL,
        status ENUM('PENDING', 'SENT', 'FAILED', 'RETRYING') NOT NULL DEFAULT 'PENDING',
        provider_message_id VARCHAR(150) NULL,
        related_client_id INT NULL,
        related_case_id INT NULL,
        error_message TEXT NULL,
        retry_count INT NOT NULL DEFAULT 0,
        sent_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (related_client_id) REFERENCES clients(id) ON DELETE SET NULL,
        FOREIGN KEY (related_case_id) REFERENCES cases(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 5. Poblar Datos Maestros (Servicios, Case Types, Configuración de Sitio)
    console.log('🌱 5. Sembrando servicios, tipos de casos e información institucional...');

    await connection.query(`
      INSERT INTO case_types (name, description) VALUES
      ('Lesión por Accidente de Tránsito (SOAT)', 'Casos vinculados a siniestros viales y cobertura SOAT'),
      ('Enfermedad o Accidente de Trabajo / Laboral (ARL)', 'Casos derivados de riesgos laborales y dictámenes ARL'),
      ('Negligencia Médica o Secuela Quirúrgica', 'Casos por presunta mala praxis o fallas asistenciales'),
      ('Lesión por Responsabilidad Civil / Terceros', 'Daños corporales generados por terceros o accidentes generales'),
      ('Secuela Traumatológica / Incapacidad Permanente', 'Evaluaciones por incapacidad permanente parcial o total'),
      ('Valoración de Estado Secuelar / Daño Corporal', 'Dictámenes integrales sobre baremos de daño corporal'),
      ('Otro Tipo de Lesión / Secuela', 'Casos periciales con requerimientos especiales')
      ON DUPLICATE KEY UPDATE description = VALUES(description);
    `);

    await connection.query(`
      INSERT INTO notification_settings (event_type, event_name, category, send_to_client, send_to_admin, is_enabled) VALUES
      ('CLIENT_CREATED', 'Creación / Registro de Cliente', 'clientes', 1, 0, 1),
      ('APPOINTMENT_REQUESTED', 'Solicitud de Cita en Página Pública', 'citas', 1, 1, 1),
      ('APPOINTMENT_CONFIRMED', 'Confirmación de Cita', 'citas', 1, 0, 1),
      ('APPOINTMENT_CANCELLED', 'Cancelación de Cita', 'citas', 1, 0, 1),
      ('PETITION_SUBMITTED', 'Solicitud de Revisión de Caso', 'revisiones', 1, 1, 1),
      ('CONTACT_SUBMITTED', 'Mensaje del Formulario de Contacto', 'contacto', 1, 1, 1),
      ('CASE_CREATED', 'Apertura de Nuevo Caso', 'expedientes', 1, 0, 1),
      ('CASE_UPDATED', 'Nueva Novedad en Expediente', 'expedientes', 1, 0, 1),
      ('DOCUMENT_UPLOADED', 'Nuevo Documento Disponible', 'documentos', 1, 0, 1),
      ('CASE_STAGE_CHANGED', 'Cambio de Etapa del Caso', 'expedientes', 1, 0, 1)
      ON DUPLICATE KEY UPDATE event_name = VALUES(event_name);
    `);

    await connection.query(`
      INSERT INTO site_info (setting_key, setting_value) VALUES
      ('company_name', 'Alianza Salud Medical Group'),
      ('company_tagline', 'Defendemos sus derechos con rigor jurídico y respaldo médico'),
      ('phone', '+57 300 123 4567'),
      ('email', 'contacto@alianzasalud.com'),
      ('address', 'Calle 100 # 15-20, Edificio Médico, Bogotá, Colombia'),
      ('office_hours', 'Lunes a Viernes: 8:00 AM - 6:00 PM | Sábados: 9:00 AM - 1:00 PM'),
      ('hero_title', 'Expertos en Derecho Médico y Valoración del Daño Corporal'),
      ('hero_subtitle', 'Acompañamiento legal especializado para víctimas de negligencia médica, accidentes laborales y de tránsito. Su bienestar es nuestra causa.'),
      ('stats_cases', '500+'),
      ('stats_experience', '15+'),
      ('stats_success_rate', '98%'),
      ('stats_specialists', '25+')
      ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value);
    `);

    // Servicios
    const services = [
      {
        slug: 'negligencia-medica',
        name: 'Negligencia Médica',
        short_description: 'Asesoría y representación jurídica en casos donde se presuma que un profesional de la salud no proporcionó el estándar de cuidado adecuado.',
        description: 'Si usted o un familiar ha sufrido daños como consecuencia de una presunta negligencia médica...',
        icon: 'Stethoscope',
        situations: JSON.stringify(["Diagnósticos errados o tardíos", "Errores quirúrgicos", "Infecciones nosocomiales"]),
        process_steps: JSON.stringify(["Evaluación inicial gratuita", "Revisión historia clínica", "Concepto médico legal", "Demanda o acuerdo"]),
        cta_text: 'Solicitar evaluación de caso'
      },
      {
        slug: 'responsabilidad-medica',
        name: 'Responsabilidad Médica',
        short_description: 'Evaluación y acompañamiento jurídico en casos de presunta responsabilidad por parte de clínicas u hospitales.',
        description: 'La responsabilidad médica abarca situaciones institucionales y clínicas...',
        icon: 'ShieldCheck',
        situations: JSON.stringify(["Complicaciones no informadas", "Falta de consentimiento informado", "Demoras injustificadas"]),
        process_steps: JSON.stringify(["Consulta inicial", "Auditoría pericial", "Dictamen de viabilidad"]),
        cta_text: 'Consultar sobre mi caso'
      },
      {
        slug: 'accidentes-transito',
        name: 'Accidentes de Tránsito',
        short_description: 'Representación jurídica para víctimas de siniestros viales con cobertura SOAT y civil.',
        description: 'Acompañamiento integral para la reclamación de daños en accidentes de tránsito...',
        icon: 'Car',
        situations: JSON.stringify(["Colisiones vehiculares con lesiones", "Atropellamientos", "Accidentes en moto"]),
        process_steps: JSON.stringify(["Atención inmediata", "Valoración de secuelas", "Reclamación a aseguradoras"]),
        cta_text: 'Reportar mi caso'
      },
      {
        slug: 'indemnizaciones-accidentes',
        name: 'Indemnización por Accidentes de Tránsito',
        short_description: 'Gestión de procesos de indemnización integral y daño moral/patrimonial.',
        description: 'Cálculo y liquidación de perjuicios físicos, patrimoniales y lucro cesante...',
        icon: 'Scale',
        situations: JSON.stringify(["Incapacidad permanente", "Pérdida de capacidad laboral", "Lucro cesante"]),
        process_steps: JSON.stringify(["Cálculo de indemnización", "Negociación directa", "Acción judicial"]),
        cta_text: 'Consultar indemnización'
      },
      {
        slug: 'cirugia-estetica',
        name: 'Responsabilidad por Cirugías Estéticas',
        short_description: 'Asesoría jurídica en casos de secuelas graves en cirugías estéticas y reconstructivas.',
        description: 'Evaluamos la debida información de riesgos y la técnica empleada...',
        icon: 'Activity',
        situations: JSON.stringify(["Resultados desfigurantes", "Falta de consentimiento", "Complicaciones quirúrgicas"]),
        process_steps: JSON.stringify(["Valoración médica de secuelas", "Análisis pericial", "Reclamación judicial"]),
        cta_text: 'Evaluar caso estético'
      },
      {
        slug: 'secuelas-traumatologicas',
        name: 'Valoración de Secuelas Traumatológicas',
        short_description: 'Dictamen pericial médico y baremación de secuelas traumatológicas e incapacidades.',
        description: 'Evaluación técnica del daño físico y funcional con médicos especialistas...',
        icon: 'HeartPulse',
        situations: JSON.stringify(["Fracturas con consolidación viciosa", "Pérdida de movilidad", "Dolor crónico"]),
        process_steps: JSON.stringify(["Examen médico", "Dictamen pericial", "Presentación ante juzgado o ARL"]),
        cta_text: 'Solicitar peritaje médico'
      }
    ];

    for (const s of services) {
      await connection.query(`
        INSERT INTO services (slug, name, short_description, description, icon, situations, process_steps, cta_text, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
        ON DUPLICATE KEY UPDATE name = VALUES(name), short_description = VALUES(short_description), description = VALUES(description), situations = VALUES(situations), process_steps = VALUES(process_steps)
      `, [s.slug, s.name, s.short_description, s.description, s.icon, s.situations, s.process_steps, s.cta_text]);
    }

    // 6. Insertar Usuarios, Médicos/Abogados y Clientes
    console.log('👤 6. Sembrando usuarios y credenciales iniciales...');

    const adminPass = await bcrypt.hash('admin123', 10);
    const lawyerPass = await bcrypt.hash('expertpass123', 10);
    const clientPass = await bcrypt.hash('cliente123', 10);
    const gabrielPass = await bcrypt.hash('gabriel123', 10);

    const usersToInsert = [
      { name: 'Admin Alianza', email: 'admin@alianzasalud.com', pass: adminPass, role: 'admin', phone: '3000000000' },
      { name: 'Dr. Santiago Ospina', email: 'santiago@alianzasalud.com', pass: lawyerPass, role: 'lawyer', phone: '3001112222' },
      { name: 'Abogado de Prueba', email: 'abogado@prueba.com', pass: lawyerPass, role: 'lawyer', phone: '3002223333' },
      { name: 'Laura Gómez', email: 'laura@example.com', pass: clientPass, role: 'client', phone: '3114445555' },
      { name: 'Gabriel Morales', email: 'gabriel@example.com', pass: gabrielPass, role: 'client', phone: '3125556666' },
      { name: 'Roberto Pérez', email: 'roberto@example.com', pass: clientPass, role: 'client', phone: '3136667777' },
    ];

    for (const u of usersToInsert) {
      await connection.query(`
        INSERT INTO users (full_name, email, password_hash, role, phone, is_active)
        VALUES (?, ?, ?, ?, ?, 1)
        ON DUPLICATE KEY UPDATE full_name = VALUES(full_name), password_hash = VALUES(password_hash), role = VALUES(role), phone = VALUES(phone)
      `, [u.name, u.email, u.pass, u.role, u.phone]);
    }

    // Abogados / Especialistas
    const lawyersToInsert = [
      { name: 'Dr. Santiago Ospina', email: 'santiago@alianzasalud.com', phone: '3001112222', spec: 'Valoración PCLO y Peritaje Médico', type: 'medical_specialist' },
      { name: 'Abogado de Prueba', email: 'abogado@prueba.com', phone: '3002223333', spec: 'Negligencia y Responsabilidad Médica', type: 'lawyer' },
    ];

    for (const l of lawyersToInsert) {
      await connection.query(`
        INSERT INTO lawyers (full_name, email, phone, specialty, role_type, is_active)
        VALUES (?, ?, ?, ?, ?, 1)
        ON DUPLICATE KEY UPDATE full_name = VALUES(full_name), phone = VALUES(phone), specialty = VALUES(specialty), role_type = VALUES(role_type)
      `, [l.name, l.email, l.phone, l.spec, l.type]);
    }

    // Obtener IDs de usuarios para relacionar con clientes
    const [userRows] = await connection.query('SELECT id, email FROM users');
    const userMap = {};
    for (const row of userRows) {
      userMap[row.email] = row.id;
    }

    // Clientes
    const clientsToInsert = [
      { name: 'Laura Gómez', email: 'laura@example.com', phone: '3114445555', doc: '10203040', addr: 'Calle 10 # 40-20', code: 'LAURA123', userId: userMap['laura@example.com'] },
      { name: 'Gabriel Morales', email: 'gabriel@example.com', phone: '3125556666', doc: '50607080', addr: 'Carrera 15 # 50-30', code: 'SEZSND72', userId: userMap['gabriel@example.com'] },
      { name: 'Roberto Pérez', email: 'roberto@example.com', phone: '3136667777', doc: '90102030', addr: 'Avenida 80 # 30-10', code: 'ROBER123', userId: userMap['roberto@example.com'] },
    ];

    for (const c of clientsToInsert) {
      await connection.query(`
        INSERT INTO clients (full_name, email, phone, document_id, address, verification_code, user_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE full_name = VALUES(full_name), phone = VALUES(phone), document_id = VALUES(document_id), address = VALUES(address), user_id = VALUES(user_id)
      `, [c.name, c.email, c.phone, c.doc, c.addr, c.code, c.userId || null]);
    }

    // 7. Insertar Casos Demostrativos
    console.log('📁 7. Verificando expedientes y casos de prueba...');
    const [existingCases] = await connection.query('SELECT count(*) as count FROM cases');
    if (existingCases[0].count === 0) {
      const [lawyerRows] = await connection.query('SELECT id, full_name FROM lawyers WHERE is_active = 1 LIMIT 1');
      const [clientRows] = await connection.query('SELECT id, full_name, email, phone, verification_code, user_id FROM clients WHERE email = "gabriel@example.com" LIMIT 1');

      if (lawyerRows.length > 0 && clientRows.length > 0) {
        const cl = clientRows[0];
        const lw = lawyerRows[0];

        const [caseRes] = await connection.query(`
          INSERT INTO cases (case_code, verification_code, client_id, client_name, client_email, client_phone, user_id, lawyer_id, service_slug, title, description, status, stage, assigned_lawyer_name)
          VALUES ('CAS-2026-0001', ?, ?, ?, ?, ?, ?, ?, 'responsabilidad-medica', 'Revisión Pericial por Secuela Post-Quirúrgica', 'Reclamación por presunta complicación no informada en intervención traumatológica.', 'in_progress', 'Revisión de Historia Clínica', ?)
        `, [cl.verification_code, cl.id, cl.full_name, cl.email, cl.phone, cl.user_id, lw.id, lw.full_name]);

        const caseId = caseRes.insertId;

        await connection.query(`
          INSERT INTO case_lawyers (case_id, lawyer_id) VALUES (?, ?)
        `, [caseId, lw.id]);

        await connection.query(`
          INSERT INTO case_updates (case_id, created_by_name, title, description, stage_name)
          VALUES (?, 'Dr. Santiago Ospina', 'Historia Clínica Recibida', 'Se recibieron los folios completos de la clínica. En proceso de análisis por el perito especialista.', 'Revisión de Historia Clínica')
        `, [caseId]);

        await connection.query(`
          INSERT INTO documents (case_id, name, type, description, original_name, mime_type, file_size, uploaded_by_name, status, visible_to_client)
          VALUES (?, 'Historia Clínica Inicial.pdf', 'recibido', 'Epicrisis e informe quirúrgico remitido por el cliente.', 'historia_clinica.pdf', 'application/pdf', 1048576, 'Dr. Santiago Ospina', 'aprobado', 1)
        `, [caseId]);
      }
    }

    // 8. Resumen de Verificación
    console.log('\n=============================================');
    console.log('🎉 INICIALIZACIÓN COMPLETADA CON ÉXITO');
    console.log('=============================================');

    const [tables] = await connection.query('SHOW TABLES');
    console.log(`✅ Total de tablas creadas: ${tables.length}`);
    for (const t of tables) {
      const tableName = Object.values(t)[0];
      const [countRow] = await connection.query(`SELECT count(*) as total FROM \`${tableName}\``);
      console.log(`   - ${tableName.padEnd(25)} : ${countRow[0].total} registros`);
    }

  } catch (err) {
    console.error('❌ Error durante la inicialización:', err);
    throw err;
  } finally {
    await connection.end();
  }
}

initRailway().catch(err => {
  console.error('Fallo en la ejecución:', err.message);
  process.exit(1);
});
