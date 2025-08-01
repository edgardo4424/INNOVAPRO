const express = require("express");
const router = express.Router();
const {
   verificarToken,
} = require("../../../../shared/middlewares/authMiddleware");
const ContratoLaboralController = require("../controllers/contratoLaboralController");

router.use(verificarToken); // Verificamos el token para todas las rutas

router.post(
   "/",
   ContratoLaboralController.crearContratoLaboral
);

module.exports = router;
