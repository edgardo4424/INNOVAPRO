const express = require("express");
const router = express.Router();

const { verificarToken } = require("../../../../shared/middlewares/authMiddleware");
const ctsController = require("../controllers/ctsController");

router.use(verificarToken); // Verificamos el token y el rol de Gerente para todas las rutas

// // 📌 Rutas protegidas solo para Gerencia
// router.get("/", gratificacionController.obtenerGratificaciones);
router.post("/calcular", ctsController.calcularCts)
router.post("/cts-individual", ctsController.calcularCtsIndividual)
router.post("/cts-individual-trunca", ctsController.calcularCtsTrunca)
router.post("/generar-cierre-cts", ctsController.cierreCts);
router.post("/historico",ctsController.obtenerHistoricocts);
router.post("/obtener-por-trabajador",ctsController.obtenerCtsPorTrabajador);

module.exports = router;