const express = require("express");
const router = express.Router();
const facturaController = require("../controllers/facturaController");
const borradorController = require("../controllers/borradorController");

// * BORRADOR
router.post("/borrador/crear", borradorController.crearBorrador);
router.get("/borradores", borradorController.obtenerBorrador);
router.get("/borrador/obtener/:id", borradorController.obtenerBorradorPorId);
router.patch("/borrador/eliminar/:id", borradorController.eliminarBorrador);

// * FACTURA - BOLETAA
router.get("/facturas", facturaController.obtenerFacturas);
router.get("/factura/:id", facturaController.obtenerFacturaPorId);
router.post("/registrar", facturaController.crearFactura);
router.get("/correlativo", facturaController.obtenerCorrelativo);
router.get("/mtc", facturaController.obtenerMTCconRuc);

// * GUIA DE REMISION

// * NOTA DE CREDITO
module.exports = router;
