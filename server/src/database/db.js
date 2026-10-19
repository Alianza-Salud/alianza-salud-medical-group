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
  // Los proveedores administrados suelen exponer una URL única (por ejemplo,
  // MYSQL_URL o DATABASE_URL), mientras que el desarrollo local usa DB_*.
  // Admitir ambas opciones evita que producción caiga silenciosamente al
  // valor por defecto "localhost".
  const connectionUri =
    process.env.MYSQL_URL ||
    process.env.MYSQL_PUBLIC_URL ||
    process.env.DATABASE_URL;

  const connectionConfig = connectionUri
    ? { uri: connectionUri }
    : {
        host: config.db.host,
        port: config.db.port,
        user: config.db.user,
        password: config.db.password,
        database: config.db.name,
      };

  const isCloudProvider =
    process.env.DB_SSL === 'true' ||
    Boolean(connectionUri && (connectionUri.includes('tidbcloud') || connectionUri.includes('aivencloud') || connectionUri.includes('ssl')));

  pool = mysql.createPool({
    ...connectionConfig,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4',
    ...(isCloudProvider ? { ssl: { rejectUnauthorized: false } } : {}),
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
