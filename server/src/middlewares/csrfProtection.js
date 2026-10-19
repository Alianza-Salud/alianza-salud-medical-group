const config = require('../config');
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

function verifyRequestOrigin(req, res, next) {
  if (SAFE_METHODS.has(req.method) || config.isDev) return next();
  const origin = req.get('origin');
  if (!origin) return next();
  const allowed = config.corsOrigin.split(',').map((value) => value.trim().replace(/\/$/, ''));
  if (allowed.includes(origin.replace(/\/$/, ''))) return next();
  return res.status(403).json({ success: false, error: { message: 'Origen de solicitud no permitido.', status: 403 } });
}

module.exports = { verifyRequestOrigin };
