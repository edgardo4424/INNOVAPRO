const express = require("express");
const router = express.Router();
const { verificarToken } = require("../../../../shared/middlewares/authMiddleware");
const ReciboController = require("../controller/reciboController");

router.use(verificarToken); // Verificamos el token para todas las rutas

// 📌 Rutas protegidas solo para Gerencia
router.post("/crear-recibo-planilla", ReciboController.crearRecibosPlanilla);

module.exports = router;