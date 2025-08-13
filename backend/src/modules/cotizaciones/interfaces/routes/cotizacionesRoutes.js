const express = require("express");
const router = express.Router();
const cotizacionController = require("../controllers/cotizacionController");
const { verificarToken } = require("../../../../shared/middlewares/authMiddleware");

router.use(verificarToken); // Verificamos el token para todas las rutas

router.get("/", cotizacionController.obtenerCotizaciones);
router.post("/", cotizacionController.crearCotizacion);
router.post("/generar-pdf", cotizacionController.generarPdfCotizacion);
router.post("/ot", cotizacionController.crearCotizacionConOT)
router.get("/:id", cotizacionController.mostrarCotizacionPorId);

// Ruta para solicitar condiciones de alquiler de una cotización 
router.put("/:id/solicitar-condiciones", cotizacionController.solicitarCondiciones)

/* router.put("/:id", cotizacionController.actualizarCotizacion);
router.delete("/:id", cotizacionController.eliminarCotizacion); */

module.exports = router;