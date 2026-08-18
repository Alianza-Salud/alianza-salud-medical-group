const mysql = require('mysql2/promise');
const config = require('../config');

/**
 * Pool de conexiones MySQL con mysql2/promise.
 *
 * Permite ejecutar consultas asíncronas con async/await.
 * Si MySQL no está encendido o configurado localmente,
 * captura el error limpiamente sin colapsar la aplicación Express.
 */

let pool = null;

try {
  pool = mysql.createPool({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.name,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4',
  });
} catch (error) {
  console.warn('[MySQL Pool Warning] No se pudo inicializar el pool de MySQL:', error.message);
}

/**
 * Probar la conexión a la base de datos al arrancar
 */
async function testConnection() {
  if (!pool) return false;
  try {
    const connection = await pool.getConnection();
    console.log('[MySQL] Conexión establecida exitosamente con la base de datos.');
    connection.release();
    return true;
  } catch (error) {
    console.warn('[MySQL Warning] No hay conexión activa con MySQL:', error.message);
    console.warn('[MySQL Warning] El backend utilizará fallback de datos mock cuando MySQL no responda.');
    return false;
  }
}

module.exports = {
  pool,
  testConnection,
};
