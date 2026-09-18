/**
 * Configuración centralizada del servidor.
 * Lee las variables de entorno y proporciona valores por defecto para desarrollo.
 */
const jwtSecret = process.env.JWT_SECRET;
const nodeEnv = process.env.NODE_ENV || 'development';
const corsOrigin = process.env.CORS_ORIGIN || (nodeEnv === 'production' ? '' : 'http://localhost:5173');

if (!jwtSecret || jwtSecret.length < 32) {
  throw new Error('JWT_SECRET is required and must be at least 32 characters');
}
if (nodeEnv === 'production' && (!corsOrigin || corsOrigin.split(',').some((origin) => origin.trim() === '*'))) {
  throw new Error('CORS_ORIGIN must contain explicit origins in production');
}

const config = {
  port: process.env.PORT || 3001,
  corsOrigin,
  nodeEnv,
  isDev: nodeEnv !== 'production',
  trustProxy: process.env.TRUST_PROXY === 'true' ? 1 : false,
  jwt: {
    secret: jwtSecret,
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    algorithm: 'HS256',
  },
  authCookie: {
    name: 'access_token',
    maxAgeMs: parseInt(process.env.AUTH_COOKIE_MAX_AGE_MS || '900000', 10),
  },
  verificationCodePepper: process.env.VERIFICATION_CODE_PEPPER || jwtSecret,

  // Configuración de MySQL
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME || 'alianza_salud',
  },
};

module.exports = config;
