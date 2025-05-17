const express = require("express");
const router = express.Router();
const usoController = require("../controllers/usoController");
const { verificarToken } = require("../../../../shared/middlewares/authMiddleware");

router.use(verificarToken); // Verificamos el token para todas las rutas

// 📌 Rutas protegidas solo para Gerencia
router.get("/", usoController.obtenerUsos);

module.exports = router;