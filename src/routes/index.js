const express = require('express');
const router = express.Router();
const clienteRoutes = require('./cliente.routes');
const cotizacionRoutes = require('./cotizacion.routes');
const usuarioRoutes = require('./usuario.routes');
const moduloRoutes = require('./modulo.routes');

router.use('/clientes', clienteRoutes);
router.use('/cotizaciones', cotizacionRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/modulos', moduloRoutes)

module.exports = router;
