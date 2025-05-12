const express = require("express");
const router = express.Router();
const estadosCotizacionController = require("../controllers/estadosCotizacionController");
const { verificarToken } = require("../../../../shared/middlewares/authMiddleware");

router.use(verificarToken); // Verificamos el token para todas las rutas

// 📌 Rutas protegidas solo para Gerencia
router.get("/", estadosCotizacionController.obtenerEstadosCotizacion);

module.exports = router;