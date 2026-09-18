const jwt = require('jsonwebtoken');
const config = require('../config');

function getCookie(req, name) {
  const cookies = String(req.headers.cookie || '').split(';');
  for (const cookie of cookies) {
    const separator = cookie.indexOf('=');
    if (separator === -1) continue;
    if (cookie.slice(0, separator).trim() === name) {
      return decodeURIComponent(cookie.slice(separator + 1).trim());
    }
  }
  return null;
}

/**
 * Middleware para verificar la validez del token JWT en la cabecera Authorization.
 * Cabecera esperada: "Authorization: Bearer <token>"
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const bearerToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  const token = getCookie(req, config.authCookie.name) || bearerToken;

  if (!token) {
    return res.status(401).json({
      success: false,
      error: { message: 'Acceso no autorizado. Se requiere token de sesión.', status: 401 },
    });
  }

  jwt.verify(token, config.jwt.secret, { algorithms: [config.jwt.algorithm] }, (err, decodedUser) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: { message: 'Token inválido o expirado. Inicie sesión nuevamente.', status: 403 },
      });
    }

    req.user = decodedUser;
    next();
  });
}

/**
 * Middleware para restringir acceso según el rol del usuario (RBAC).
 * Ejemplo de uso: requireRole('admin', 'lawyer')
 */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'No posee los permisos necesarios para realizar esta acción.',
          status: 403,
        },
      });
    }
    next();
  };
}

module.exports = {
  authenticateToken,
  requireRole,
};
