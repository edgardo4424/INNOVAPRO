const express = require('express');
const router = express.Router();
const controller = require('../controllers/cliente.controller');

router.get('/', controller.obtenerTodos);
router.post('/', controller.crear);
router.get('/:id/cotizaciones', controller.obtenerCotizacionesPorCliente);

module.exports = router;
