const express = require("express");
const router = express.Router();
const tarifasTransporteController = require("../controllers/tarifasTransporteController");
const { verificarToken } = require("../../../../shared/middlewares/authMiddleware");

router.use(verificarToken); // Verificamos el token para todas las rutas

router.get("/", tarifasTransporteController.obtenerTarifasTransporte);

module.exports = router;