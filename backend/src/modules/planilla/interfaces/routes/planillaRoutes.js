const express = require("express");
const router = express.Router();
const planillaController = require("../controllers/planillaController");

const { verificarToken } = require("../../../../shared/middlewares/authMiddleware");

router.use(verificarToken); // Verificamos el token y el rol de Gerente para todas las rutas

// 📌 Rutas protegidas solo para Gerencia

router.post("/planilla-quincenal-calcular", planillaController.calcularPlanillaQuincenal);
router.post("/planilla-mensual-calcular", planillaController.calcularPlanillaMensualPorTrabajador);

router.post("/planilla-quincenal-cierre", planillaController.cierrePlanillaQuincenal);
router.post("/quincenal", planillaController.obtenerPlanillaQuincenalCerradas);
router.post("/quincenal-por-trabajador", planillaController.obtenerPlanillaQuincenalPorTrabajador)
router.post("/quincenal-total-por-trabajador", planillaController.obtenerTotalPlanillaQuincenalPorTrabajador);

//!Ruta para cerrar la planilla mensual 
router.post("/planilla-mensual-cierre",planillaController.cierrePlanillaMensual);

//!Ruta para obtener los datos historicos de una planilla
router.post("/mensual", planillaController.obtenerPlanillaMensualCerradas);

router.post("/planilla-mensual-trunca", planillaController.calcularPlanillaMensualTruncaPorTrabajador);

router.post("/exportar-plame",planillaController.exportarPlame);

module.exports = router; 