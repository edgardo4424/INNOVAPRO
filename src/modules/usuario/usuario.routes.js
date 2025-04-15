const express = require('express');
const router = express.Router();
const controller = require('./usuario.controller');
const middleware = require('../../middlewares/verificarToken');

router.get('/', controller.obtenerTodos)
router.get('/:id', controller.obtenerUno)
router.post('/', controller.crear)
router.put('/:id', controller.actualizar)
router.delete('/:id', controller.eliminar)
router.post('/login', controller.login);
router.get('/refresh-token', middleware.verificarToken, controller.refreshToken);

module.exports = router;
