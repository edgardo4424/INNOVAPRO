const express = require('express');
const router = express.Router();
const controller = require('../controllers/modulo.controller');

router.get('/', controller.obtenerTodas);
router.post('/', controller.crear);

module.exports = router;
