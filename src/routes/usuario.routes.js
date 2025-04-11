const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuario.controller');
const middleware = require('../middlewares/verificarToken');

router.get('/', controller.obtenerTodos)
router.post('/', controller.crear)
router.post('/login', controller.login);
router.get('/refresh-token', middleware.verificarToken, controller.refreshToken);


module.exports = router;
