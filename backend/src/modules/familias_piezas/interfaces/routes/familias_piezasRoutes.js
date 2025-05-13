const express = require("express");
const router = express.Router();
const familiaPiezaController = require("../controllers/familiaPiezaController");
const { verificarToken } = require("../../../../shared/middlewares/authMiddleware");

router.use(verificarToken); // Verificamos el token para todas las rutas

// 📌 Rutas protegidas solo para Gerencia
router.get("/", familiaPiezaController.obtenerFamiliasPiezas);

module.exports = router;