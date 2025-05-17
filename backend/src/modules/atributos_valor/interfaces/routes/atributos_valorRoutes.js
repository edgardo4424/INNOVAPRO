const express = require("express");
const router = express.Router();
const atributoController = require("../controllers/atributosValorController");
const { verificarToken } = require("../../../../shared/middlewares/authMiddleware");

router.use(verificarToken); // Verificamos el token para todas las rutas

router.get("/", atributoController.obtenerAtributosValor);
router.post("/", atributoController.crearAtributosValor);

module.exports = router;