require('dotenv').config();
const bcrypt = require('bcryptjs');
const { pool } = require('./db');

async function seedUsers() {
  if (!pool) {
    console.error('No MySQL pool');
    process.exit(1);
  }

  console.log('--- Creando usuarios iniciales ---');

  const adminPass = await bcrypt.hash('admin123', 10);
  const lawyerPass = await bcrypt.hash('expertpass123', 10);
  const clientPass = await bcrypt.hash('cliente123', 10);
  const gabrielPass = await bcrypt.hash('gabriel123', 10);

  // 1. Insertar o actualizar usuarios
  const users = [
    { name: 'Admin Alianza', email: 'admin@alianzasalud.com', pass: adminPass, role: 'admin', phone: '3000000000' },
    { name: 'Dr. Santiago Ospina', email: 'santiago@alianzasalud.com', pass: lawyerPass, role: 'lawyer', phone: '3001112222' },
    { name: 'Abogado de Prueba', email: 'abogado@prueba.com', pass: lawyerPass, role: 'lawyer', phone: '3002223333' },
    { name: 'Laura Gómez', email: 'laura@example.com', pass: clientPass, role: 'client', phone: '3114445555' },
    { name: 'Gabriel Morales', email: 'gabriel@example.com', pass: gabrielPass, role: 'client', phone: '3125556666' },
    { name: 'Roberto Pérez', email: 'roberto@example.com', pass: clientPass, role: 'client', phone: '3136667777' },
  ];

  for (const u of users) {
    const [res] = await pool.query(
      `INSERT INTO users (full_name, email, password_hash, role, phone, is_active)
       VALUES (?, ?, ?, ?, ?, 1)
       ON DUPLICATE KEY UPDATE full_name = VALUES(full_name), password_hash = VALUES(password_hash), role = VALUES(role), phone = VALUES(phone)`,
      [u.name, u.email, u.pass, u.role, u.phone]
    );
  }

  console.log('✅ Usuarios insertados');

  // 2. Insertar Abogados / Médicos Especialistas
  const [adminUser] = await pool.query('SELECT id FROM users WHERE email = ?', ['admin@alianzasalud.com']);
  const [santiagoUser] = await pool.query('SELECT id FROM users WHERE email = ?', ['santiago@alianzasalud.com']);
  const [abogadoTestUser] = await pool.query('SELECT id FROM users WHERE email = ?', ['abogado@prueba.com']);

  const lawyers = [
    { name: 'Dr. Santiago Ospina', email: 'santiago@alianzasalud.com', phone: '3001112222', spec: 'Valoración PCLO y Peritaje Médico', type: 'medical_specialist' },
    { name: 'Abogado de Prueba', email: 'abogado@prueba.com', phone: '3002223333', spec: 'Negligencia y Responsabilidad Médica', type: 'lawyer' },
  ];

  for (const l of lawyers) {
    await pool.query(
      `INSERT INTO lawyers (full_name, email, phone, specialty, role_type, is_active)
       VALUES (?, ?, ?, ?, ?, 1)
       ON DUPLICATE KEY UPDATE full_name = VALUES(full_name), phone = VALUES(phone), specialty = VALUES(specialty), role_type = VALUES(role_type)`,
      [l.name, l.email, l.phone, l.spec, l.type]
    );
  }

  console.log('✅ Abogados / Especialistas insertados');

  // 3. Insertar Clientes
  const [lauraUser] = await pool.query('SELECT id FROM users WHERE email = ?', ['laura@example.com']);
  const [gabrielUser] = await pool.query('SELECT id FROM users WHERE email = ?', ['gabriel@example.com']);
  const [robertoUser] = await pool.query('SELECT id FROM users WHERE email = ?', ['roberto@example.com']);

  const clients = [
    { name: 'Laura Gómez', email: 'laura@example.com', phone: '3114445555', doc: '10203040', addr: 'Calle 10 # 40-20', code: 'LAURA123', userId: lauraUser[0]?.id },
    { name: 'Gabriel Morales', email: 'gabriel@example.com', phone: '3125556666', doc: '50607080', addr: 'Carrera 15 # 50-30', code: 'SEZSND72', userId: gabrielUser[0]?.id },
    { name: 'Roberto Pérez', email: 'roberto@example.com', phone: '3136667777', doc: '90102030', addr: 'Avenida 80 # 30-10', code: 'ROBER123', userId: robertoUser[0]?.id },
  ];

  for (const c of clients) {
    await pool.query(
      `INSERT INTO clients (full_name, email, phone, document_id, address, verification_code, user_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE full_name = VALUES(full_name), phone = VALUES(phone), document_id = VALUES(document_id), address = VALUES(address), user_id = VALUES(user_id)`,
      [c.name, c.email, c.phone, c.doc, c.addr, c.code, c.userId || null]
    );
  }

  console.log('✅ Clientes insertados');
  process.exit(0);
}

seedUsers().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
