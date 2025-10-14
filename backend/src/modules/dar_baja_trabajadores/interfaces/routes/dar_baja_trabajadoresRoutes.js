const express = require("express");
const router = express.Router();
const darDeBajaController = require("../controllers/darBajaTrabajadorController");

const { verificarToken } = require("../../../../shared/middlewares/authMiddleware");

router.use(verificarToken); // Verificamos el token y el rol de Gerente para todas las rutas

// 📌 Rutas protegidas solo para Gerencia
router.post("/", darDeBajaController.darBajaTrabajadorv2);
router.get("/", darDeBajaController.obtenerTrabajadoresDadosDeBaja);
router.get("/:id", darDeBajaController.visualizarBajaTrabajador);


module.exports = router;