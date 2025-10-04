const express = require("express");
const router = express.Router();
const facturaController = require("../controllers/facturaController");
const borradorController = require("../controllers/borradorController");
const guiaRemisionController = require("../controllers/guiaRemisionController");
const notaController = require("../controllers/notaController");

const { verificarToken } = require("../../../../shared/middlewares/authMiddleware");


// router.use(verificarToken); // Verificamos el token y el rol de Gerente para as las rutas


// * BORRADOR
router.post("/borrador/crear", borradorController.crearBorrador);
router.get("/borradores", borradorController.obtenerBorrador);
router.get("/borrador", borradorController.obtenerBorradorPorId);
router.patch("/borrador/eliminar/:id", borradorController.eliminarBorrador);

// ?? FACTURA - BOLETAA
router.get("/facturas", facturaController.obtenerFacturas);
router.get("/factura/:id", facturaController.obtenerFacturaPorId);
router.post("/factura/detallada", facturaController.obtenerFacturaDetallada);
router.post("/documentos", facturaController.obtenerRelacionesFacturas);
router.post("/registrar", facturaController.crearFactura);
router.post("/factura/anular", facturaController.anularFactura);
router.post("/correlativo", facturaController.obtenerCorrelativo);
router.post("/cdr-zip", facturaController.obtenerCdrZip);
router.get("/mtc", facturaController.obtenerMTCconRuc);

// ?? GUIA DE REMISION
router.get("/guia-remision", guiaRemisionController.obtenerGuiasRemision);
router.post("/guia-remision/crear", guiaRemisionController.crearGuiaRemision);
router.post("/guia-remision/detallada", guiaRemisionController.obtenerGuiaDetallada);
router.post("/guia-remision/correlativo", guiaRemisionController.obtenerCorrelativo);
router.post("/guia-remision/relaciones", guiaRemisionController.obtenerRelacionesGuias);

// ?? NOTA DE CREDITO
router.get("/nota-debito-credito", notaController.obtenerNotas);
router.post("/nota-debito-credito/crear", notaController.crearNota);
router.post("/nota-debito-credito/detallada", notaController.obtenerNotaDetallada);
router.post("/nota-debito-credito/correlativo", notaController.obtenerCorrelativo);


// ?? FACTURA - NOTA - GUIA
router.post("/reporte-venta", facturaController.reporteVentas);

module.exports = router;
