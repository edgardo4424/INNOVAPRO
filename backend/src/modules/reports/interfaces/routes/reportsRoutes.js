const express = require("express");
const router = express.Router();

const reportsController = require("../../interfaces/controller/reportsController");

const { verificarToken } = require("../../../../shared/middlewares/authMiddleware");


// router.use(verificarToken); // Verificamos el token y el rol de Gerente para todas las rutas

router.get("/reportes", (req, res) => {
    res.json({ message: "Reportes" });
});
router.post("/reporte-factura", reportsController.reporteFactura);


module.exports = router;
