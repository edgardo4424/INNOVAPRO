const express = require("express");
const router = express.Router();
const gratificacionController = require("../controllers/gratificacionController");

const { verificarToken } = require("../../../../shared/middlewares/authMiddleware");

router.use(verificarToken); // Verificamos el token y el rol de Gerente para todas las rutas

// 📌 Rutas protegidas solo para Gerencia
router.post("/", gratificacionController.obtenerGratificacionesCerradas);
router.post("/calcular", gratificacionController.calcularGratificaciones)
router.post("/cierre", gratificacionController.cierreGratificaciones)
router.post("/cierre-por-trabajador", gratificacionController.cierreGratificacionPorTrabajador)
router.post("/por-trabajador", gratificacionController.obtenerGratificacionPorTrabajador)


module.exports = router;