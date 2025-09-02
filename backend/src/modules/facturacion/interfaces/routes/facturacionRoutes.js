const express = require("express");
const router = express.Router();
const facturaController = require("../controllers/facturaController");
const borradorController = require("../controllers/borradorController");
const guiaRemisionController = require("../controllers/guiaRemisionController");

const { verificarToken } = require("../../../../shared/middlewares/authMiddleware");
const notaCreditoDebitoController = require("../controllers/notaCreditoDebitoController");


// router.use(verificarToken); // Verificamos el token y el rol de Gerente para todas las rutas


// * BORRADOR
router.post("/borrador/crear", borradorController.crearBorrador);
router.get("/borradores", borradorController.obtenerBorrador);
router.get("/borrador", borradorController.obtenerBorradorPorId);
router.patch("/borrador/eliminar/:id", borradorController.eliminarBorrador);

// * FACTURA - BOLETAA
router.get("/facturas", facturaController.obtenerFacturas);
router.get("/factura/:id", facturaController.obtenerFacturaPorId);
router.post("/factura/detallada", facturaController.obtenerFacturaDetallada);
router.post("/documentos", facturaController.obtenerRelacionesFacturas);
router.post("/registrar", facturaController.crearFactura);
router.post("/correlativo", facturaController.obtenerCorrelativo);
router.post("/cdr-zip", facturaController.obtenerCdrZip);
router.get("/mtc", facturaController.obtenerMTCconRuc);

// * GUIA DE REMISION
router.post("/guia-remision/crear", guiaRemisionController.crearGuiaRemision);
router.get("/guia-remision", guiaRemisionController.obtenerGuiasRemision);
router.post("/guia-remision/correlativo", guiaRemisionController.obtenerCorrelativo);
router.post("/guia-remision/relaciones", guiaRemisionController.obtenerRelacionesGuias);

// * NOTA DE CREDITO
router.post("/nota-debito-credito/crear", notaCreditoDebitoController.crearNotaCreditoDebito);

module.exports = router;
