require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const { errorHandler } = require('./middlewares/errorHandler');
const routes = require('./routes');
const config = require('./config');
const { testConnection } = require('./database/db');

const app = express();

// ------- Middlewares globales -------
app.use(helmet({ crossOriginResourcePolicy: false }));
// ------- Configuración CORS flexible -------
const allowedOrigins = (config.corsOrigin || '')
  .split(',')
  .map(o => o.trim().replace(/\/$/, ''))
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Permitir peticiones sin origen (herramientas locales, server-to-server) o en desarrollo
    if (!origin || config.isDev || config.corsOrigin === '*') {
      return callback(null, true);
    }
    const cleanOrigin = origin.replace(/\/$/, '');
    // Coincidencia exacta con dominios configurados o cualquier subdominio de vercel.app
    if (allowedOrigins.includes(cleanOrigin) || cleanOrigin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(new Error(`Bloqueado por CORS: Origen no permitido (${origin})`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos subidos de forma estática
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Servir frontend compilado en producción / túnel remoto si existe client/dist
const clientDistPath = path.resolve(__dirname, '../../client/dist');
app.use(express.static(clientDistPath));

// ------- Rutas API -------
app.use('/api', routes);

// SPA fallback: Para cualquier otra ruta GET, retornar index.html del frontend
app.get('*', (req, res, next) => {
  const indexPath = path.join(clientDistPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) next();
  });
});

// ------- Manejo de errores -------
app.use(errorHandler);

// ------- Iniciar servidor -------
const PORT = config.port;
app.listen(PORT, async () => {
  console.log(`[Server] Ejecutándose en http://localhost:${PORT}`);
  console.log(`[Server] Health check: http://localhost:${PORT}/api/health`);
  await testConnection();
});

module.exports = app;
