/**
 * Configuración centralizada del servidor.
 * Lee las variables de entorno y proporciona valores por defecto.
 *
 * En fases futuras, incluirá configuración de MySQL.
 */
const config = {
  port: process.env.PORT || 3001,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  nodeEnv: process.env.NODE_ENV || 'development',

  // Configuración futura de MySQL (Fase 2+)
  // db: {
  //   host: process.env.DB_HOST || 'localhost',
  //   port: process.env.DB_PORT || 3306,
  //   user: process.env.DB_USER || 'root',
  //   password: process.env.DB_PASSWORD || '',
  //   name: process.env.DB_NAME || 'alianza_salud',
  // },
};

module.exports = config;
