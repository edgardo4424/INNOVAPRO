const express = require("express");
const router = express.Router();
const stockController = require("../controllers/stockController");
const {
   verificarToken,
} = require("../../../../shared/middlewares/authMiddleware");

router.use(verificarToken); // Middleware para verificar el token JWT

// 📌 Rutas protegidas solo para Gerencia
router.get("/", stockController.obtenerStockPiezasPorEstado);
router.post("/", stockController.crearStock);
router.get("/:id", stockController.obtenerStockPorId);
router.put("/disponible", stockController.actualizarStockDisponible); //ruta para actualizar el stock Disponible
router.put("/fijo", stockController.actualizarStockFijo); //ruta para actualizar el stock Fijo

module.exports = router;
