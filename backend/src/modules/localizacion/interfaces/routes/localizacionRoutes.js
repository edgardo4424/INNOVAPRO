// interfaces/http/routes/localizacion.js
const express = require("express");
const router = express.Router();
const { verificarToken } = require("../../../../shared/middlewares/authMiddleware");
const LocalizacionController = require("../controller/localizacionController");

router.use(verificarToken);
router.post("/", LocalizacionController.obtenerLatLong);
router.post("/direccion", LocalizacionController.obtenerDireccion);
router.post("/ubigeo", LocalizacionController.obtenerUbigeo);


module.exports = router;
