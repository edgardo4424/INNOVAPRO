const express = require('express');
const router = express.Router();
const controller = require('../controllers/cotizacion.controller');

router.get('/', controller.obtenerTodas);
router.post('/', controller.crear);

module.exports = router;
