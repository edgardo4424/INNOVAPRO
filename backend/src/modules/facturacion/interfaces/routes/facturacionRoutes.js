const express = require("express");
const router = express.Router();
const facturaController = require("../controllers/facturaController");
const borradorController = require("../controllers/borradorController");
const guiaRemisionController = require("../controllers/guiaRemisionController");

// * BORRADOR
router.post("/borrador/crear", borradorController.crearBorrador);
router.get("/borradores", borradorController.obtenerBorrador);
router.get("/borrador", borradorController.obtenerBorradorPorId);
router.patch("/borrador/eliminar/:id", borradorController.eliminarBorrador);

// * FACTURA - BOLETAA
router.get("/facturas", facturaController.obtenerFacturas);
router.get("/factura/:id", facturaController.obtenerFacturaPorId);
router.post("/registrar", facturaController.crearFactura);
router.get("/correlativo", facturaController.obtenerCorrelativo);
router.get("/mtc", facturaController.obtenerMTCconRuc);

// * GUIA DE REMISION
router.post("/guia-remision/crear", guiaRemisionController.crearGuiaRemision);

// * NOTA DE CREDITO
module.exports = router;
