const express = require("express");
const router = express.Router();
const cotizacionDetalleController = require("../../controllers/cotizaciones/cotizacionDetalleController");

// 📌 Rutas de detalles de cotización
router.get("/", cotizacionDetalleController.obtenerDetalles);
router.get("/cotizacion/:cotizacionId", cotizacionDetalleController.obtenerDetallesPorCotizacion);
router.post("/", cotizacionDetalleController.crearDetalle);
router.put("/:id", cotizacionDetalleController.actualizarDetalle);
router.delete("/:id", cotizacionDetalleController.eliminarDetalle);

module.exports = router;