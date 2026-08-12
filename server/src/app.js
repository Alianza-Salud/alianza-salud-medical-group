require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { errorHandler } = require('./middlewares/errorHandler');
const routes = require('./routes');
const config = require('./config');
const { testConnection } = require('./database/db');

const app = express();

// ------- Middlewares globales -------
app.use(helmet());
app.use(cors({
  origin: config.isDev ? true : config.corsOrigin,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ------- Rutas -------
app.use('/api', routes);

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
