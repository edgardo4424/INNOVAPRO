const express = require("express");
const router = express.Router();

const { verificarToken } = require("../../../../shared/middlewares/authMiddleware");
const choferController = require("../controller/choferController");
const transporteController = require("../controller/transportistaController");
const vehiculosController = require("../controller/vehiculos");


router.use(verificarToken); // Verificamos el token y el rol de Gerente para as las rutas

// ?? TRANSPORTE
router.post("/transportista", transporteController.guardar);
router.delete("/transportista", transporteController.eliminar);
router.get("/transportista", transporteController.listar);


// ?? CHOFER - CRUD
router.post("/chofer", choferController.guardar);
router.delete("/chofer", choferController.eliminar);
router.get("/chofer", choferController.listar);

// ?? VEHICULOS 
router.get("/vehiculo", vehiculosController.listar);

module.exports = router;
