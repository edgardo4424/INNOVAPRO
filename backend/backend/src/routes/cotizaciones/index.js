const express = require("express");
const router = express.Router();

// Modularización de rutas de cotización
router.use("/", require("./cotizacionRoutes"));
router.use("/detalles", require("./cotizacionDetallesRoutes"));

module.exports = router;