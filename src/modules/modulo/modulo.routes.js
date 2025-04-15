const express = require('express');
const router = express.Router();
const controller = require('./modulo.controller');

router.get('/', controller.obtenerTodas);
router.post('/', controller.crear);

module.exports = router;
