const express = require('express');
const router = express.Router();
const QuintaCategoriaController = require('../controllers/QuintaCategoriaController');
const {
   verificarToken,
} = require("../../../../shared/middlewares/authMiddleware");

router.use(verificarToken); // Verificamos el token para todas las rutas

router.post('/previsualizar', QuintaCategoriaController.previsualizar);
router.post('/', QuintaCategoriaController.crear);
router.post('/:id/recalcular', QuintaCategoriaController.recalcular);
router.get('/:id', QuintaCategoriaController.getById);
router.get('/', QuintaCategoriaController.list);

module.exports = router;