const express = require("express");
const router = express.Router();
const {
   verificarToken,
} = require("../../../../shared/middlewares/authMiddleware");
const TrabajadorController = require("../controllers/trabajadorController");

router.use(verificarToken); // Verificamos el token para todas las rutas

router.post("/crear",TrabajadorController.crearTrabajador);
router.get("/filial/:id",TrabajadorController.obtenerTrabajadoresPorFilial)

module.exports = router;
