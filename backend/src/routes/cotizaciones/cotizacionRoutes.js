const express = require("express");
const router = express.Router();
const cotizacionController = require("../../controllers/cotizaciones/cotizacionController");

// 📌 Cotizaciones principales
router.get("/", cotizacionController.obtenerCotizaciones);
router.get("/:id", cotizacionController.obtenerCotizacionPorId);
router.post("/", cotizacionController.crearCotizacion);
router.put("/:id", cotizacionController.actualizarCotizacion);
router.delete("/:id", cotizacionController.eliminarCotizacion);
router.post("/generar-pdf/:id", cotizacionController.generarPDFCotizacion);

module.exports = router;