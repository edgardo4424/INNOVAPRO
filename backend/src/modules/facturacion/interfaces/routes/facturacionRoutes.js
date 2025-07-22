const express = require("express");
const router = express.Router();
const facturaController = require("../controllers/facturaController");

router.get("/", facturaController.obtenerFacturas);
router.get("/factura/:id", facturaController.obtenerFacturaPorId);
router.post("/registrar", facturaController.crearFactura);
module.exports = router;