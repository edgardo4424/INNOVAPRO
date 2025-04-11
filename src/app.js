const express = require('express');
const applyMiddlewares = require('./middlewares');
const routes = require('./routes');
const connectDB = require('./config/database');
const errorHandler = require('./middlewares/errorHandler')
const app = express();

// Middlewares
applyMiddlewares(app);

// Conexión a la base de datos con manejo de errores
(async () => {
    try {
      await connectDB(); // Asegúrate que connectDB devuelva una Promise
    } catch (error) {
      console.error('❌ Error al conectar a la base de datos:', error.message);
    }
  })();

// Rutas principales
app.use('/api', routes);

// ✅ Ruta no encontrada (404 personalizada)
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    error: 'La ruta solicitada no existe',
    path: req.originalUrl
  });
});

// ✅ Middleware global de errores (último)
app.use(errorHandler);

module.exports = app;
