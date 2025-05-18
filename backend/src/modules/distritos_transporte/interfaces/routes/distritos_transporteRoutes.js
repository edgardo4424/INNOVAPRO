const express = require("express");
const router = express.Router();
const distritosTransporteController = require("../controllers/distritosTransporteController");
const { verificarToken } = require("../../../../shared/middlewares/authMiddleware");

router.use(verificarToken); // Verificamos el token para todas las rutas

router.get("/", distritosTransporteController.obtenerDistritosTransporte);

module.exports = router;