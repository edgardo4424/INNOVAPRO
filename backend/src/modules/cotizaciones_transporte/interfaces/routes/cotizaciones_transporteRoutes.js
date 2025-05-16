const express = require("express");
const router = express.Router();
const cotizacionesTransporteController = require("../controllers/cotizacionesTransporteController");
const { verificarToken } = require("../../../../shared/middlewares/authMiddleware");

router.use(verificarToken); // Verificamos el token para todas las rutas

router.get("/", cotizacionesTransporteController.obtenerCotizacionesTransporte);
router.post("/costo-transporte", cotizacionesTransporteController.calcularCostoTransporte);

module.exports = router;