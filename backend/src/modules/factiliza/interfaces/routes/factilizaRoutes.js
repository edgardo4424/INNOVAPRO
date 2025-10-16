const express = require("express");
const router = express.Router();

const factilizaController = require("../controller/factilizaController");

const { verificarToken } = require("../../../../shared/middlewares/authMiddleware");


// router.use(verificarToken); // Verificamos el token y el rol de Gerente para as las rutas


// * BORRADOR
router.post("/verificar-estado-sunat", factilizaController.verificarEstadoSunat);
router.post("/emitir-factura", factilizaController.emitirFactura);
router.post("/emitir-nota", factilizaController.emitirNota);
router.post("/emitir-guia", factilizaController.emitirGuia);



module.exports = router;
