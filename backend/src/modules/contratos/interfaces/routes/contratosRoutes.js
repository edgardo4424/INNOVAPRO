const express = require("express");
const router = express.Router();
const {
   verificarToken,
} = require("../../../../shared/middlewares/authMiddleware");
const ContratoController = require("../controllers/contratosController");
router.use(verificarToken); // Verificamos el token para todas las rutas

router.get("/",ContratoController.obtenerContratos);
router.post("/",ContratoController.crearContrato);
router.put("/",ContratoController.actualizarContrato);
router.get("/autocompletar-cotizacion/:id", ContratoController.autocompletarCotizacionParaCrearContrato);


// Ruta para solicitar condiciones de alquiler de un contrato 
router.put("/:id/solicitar-condiciones", ContratoController.solicitarCondiciones);

// Ruta para generar contrato en formato pdf
router.get("/generar-pdf/:id", ContratoController.generarPdf)


module.exports = router;