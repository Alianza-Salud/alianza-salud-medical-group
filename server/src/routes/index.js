const express = require('express');
const router = express.Router();

/**
 * Rutas base de la API.
 *
 * En fases futuras se añadirán:
 *   /services     — GET, GET /:slug
 *   /appointments — GET /availability, POST
 *   /contact      — POST
 *   /auth         — POST /register, POST /login
 *   /cases        — GET, GET /:id
 */

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Alianza Salud Medical Group API',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
