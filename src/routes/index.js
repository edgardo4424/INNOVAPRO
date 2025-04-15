const express = require('express');
const router = express.Router();
const clienteRoutes = require('../modules/cliente/cliente.routes');
const cotizacionRoutes = require('../modules/cotizacion/cotizacion.routes');
const usuarioRoutes = require('../modules/usuario/usuario.routes');
const moduloRoutes = require('../modules/modulo/modulo.routes');

router.use('/clientes', clienteRoutes);
router.use('/cotizaciones', cotizacionRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/modulos', moduloRoutes)

module.exports = router;
