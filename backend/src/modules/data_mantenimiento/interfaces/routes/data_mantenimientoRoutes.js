const express = require("express");
const router = express.Router();
const dataMantenimientoController = require("../controllers/dataMantenimientoController");

const { verificarToken } = require("../../../../shared/middlewares/authMiddleware");

router.use(verificarToken); // Verificamos el token y el rol de Gerente para todas las rutas

// 📌 Rutas protegidas solo para Gerencia
router.get("/", dataMantenimientoController.obtenerDataMantenimiento);
router.get("/:id", dataMantenimientoController.obtenerDataMantenimientoPorId);
router.get("/codigo/:codigo", dataMantenimientoController.obtenerDataMantenimientoPorCodigo);
router.put("/:id", dataMantenimientoController.actualizarDataMantenimiento);
router.get("/codigo-importe/:codigo_importe", dataMantenimientoController.obtenerDataMantenimientoPorCodigoImporte);

module.exports = router;