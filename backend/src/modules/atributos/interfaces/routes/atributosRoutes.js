const express = require("express");
const router = express.Router();
const atributoController = require("../controllers/atributoController");
const { verificarToken } = require("../../../../shared/middlewares/authMiddleware");

router.use(verificarToken); // Verificamos el token para todas las rutas

router.get("/", atributoController.obtenerAtributos);
router.get("/usos/:id", atributoController.obtenerAtributosPorUsoId);

module.exports = router;