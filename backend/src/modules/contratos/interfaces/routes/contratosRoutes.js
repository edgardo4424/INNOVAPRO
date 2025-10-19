const express = require("express");
const router = express.Router();
const contratonController = require("../controllers/contratonController");
const { verificarToken } = require("../../../../shared/middlewares/authMiddleware");

router.use(verificarToken); // Verificamos el token para todas las rutas

router.get("/", contratonController.obtenerContratos);
router.post("/", contratonController.crearContrato);
router.get("/:id", contratonController.mostrarContratoPorId);

module.exports = router;