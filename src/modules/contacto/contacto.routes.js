const express = require('express');
const router = express.Router();
const controller = require('./cliente.controller');

router.get('/', controller.obtenerTodos);
router.get('/:id', controller.obtenerUno);
router.post('/', controller.crear);
router.put('/:id', controller.actualizar);
router.delete('/:id', controller.eliminar)

module.exports = router;
