const express = require("express");
const router = express.Router();
const facturaController = require("../controllers/facturaController");

router.get("/facturas", facturaController.obtenerFacturas);
router.get("/factura/:id", facturaController.obtenerFacturaPorId);
router.post("/registrar", facturaController.crearFactura);
router.get("/correlativo", facturaController.obtenerCorrelativo);
router.patch("/eliminar-borrador/:id", facturaController.eliminarBorrador);
module.exports = router;