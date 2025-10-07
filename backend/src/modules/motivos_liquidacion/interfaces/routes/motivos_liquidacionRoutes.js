const express = require("express");
const router = express.Router();
const motivosLiquidacionController = require("../controllers/motivosLiquidacionController");

const { verificarToken } = require("../../../../shared/middlewares/authMiddleware");

router.use(verificarToken);// Verificamos el token y el rol de Gerente para todas las rutas

router.get("/", motivosLiquidacionController.obtenerMotivosLiquidacion);


module.exports = router;