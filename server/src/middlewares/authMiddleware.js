const jwt = require('jsonwebtoken');
const config = require('../config');

const JWT_SECRET = process.env.JWT_SECRET || 'alianza_salud_secret_key_2026_phase3';

/**
 * Middleware para verificar la validez del token JWT en la cabecera Authorization.
 * Cabecera esperada: "Authorization: Bearer <token>"
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: { message: 'Acceso no autorizado. Se requiere token de sesión.', status: 401 },
    });
  }

  jwt.verify(token, JWT_SECRET, (err, decodedUser) => {
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
