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
app.use(cors({
  origin: config.isDev ? true : config.corsOrigin,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
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
