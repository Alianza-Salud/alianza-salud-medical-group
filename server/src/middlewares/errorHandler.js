/**
 * Middleware de manejo de errores genérico.
 * Captura errores no manejados y devuelve una respuesta JSON consistente.
 */
function errorHandler(err, req, res, _next) {
  console.error('[Error]', err.message);

  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Error interno del servidor'
      : err.message || 'Error interno del servidor';

  res.status(statusCode).json({
    error: {
      message,
      status: statusCode,
    },
  });
}

module.exports = { errorHandler };
