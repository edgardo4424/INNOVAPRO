const express = require("express");
const router = express.Router();
const planillaController = require("../controllers/planillaController");

const { verificarToken } = require("../../../../shared/middlewares/authMiddleware");

router.use(verificarToken); // Verificamos el token y el rol de Gerente para todas las rutas

// 📌 Rutas protegidas solo para Gerencia

router.post("/planilla-quincenal-calcular", planillaController.calcularPlanillaQuincenal);
router.post("/planilla-mensual-calcular", planillaController.calcularPlanillaMensualPorTrabajador);

router.post("/planilla-quincenal-cierre", planillaController.cierrePlanillaQuincenal);

module.exports = router; 