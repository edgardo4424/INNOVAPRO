const express = require("express");
const router = express.Router();

const reporteFacturaController = require("../controller/reporteFacturaController");

const { verificarToken } = require("../../../../shared/middlewares/authMiddleware");


// router.use(verificarToken); // Verificamos el token y el rol de Gerente para todas las rutas

router.post("/reporte-factura", reporteFacturaController.reporteFactura);
router.post("/reporte-guia", reporteFacturaController.reporteGuia);


module.exports = router;
