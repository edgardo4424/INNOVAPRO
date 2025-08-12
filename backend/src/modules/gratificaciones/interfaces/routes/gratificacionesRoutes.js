const express = require("express");
const router = express.Router();
const gratificacionController = require("../controllers/gratificacionController");

const { verificarToken } = require("../../../../shared/middlewares/authMiddleware");

router.use(verificarToken); // Verificamos el token y el rol de Gerente para todas las rutas

// 📌 Rutas protegidas solo para Gerencia
router.get("/", gratificacionController.obtenerGratificaciones);
router.post("/calcular", gratificacionController.calcularGratificaciones)

module.exports = router;