const express = require("express");
const router = express.Router();
const piezasUsosController = require("../controllers/piezasUsosController");
const { verificarToken } = require("../../../../shared/middlewares/authMiddleware");

router.use(verificarToken); // Verificamos el token para todas las rutas

// 📌 Rutas protegidas solo para Gerencia
router.get("/", piezasUsosController.obtenerPiezasUsos);

module.exports = router;