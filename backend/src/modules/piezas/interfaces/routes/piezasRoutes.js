const express = require("express");
const router = express.Router();
const piezaController = require("../controllers/piezaController");
const { verificarToken } = require("../../../../shared/middlewares/authMiddleware");

router.use(verificarToken); // Verificamos el token para todas las rutas

// 📌 Rutas protegidas solo para Gerencia
router.get("/", piezaController.obtenerPiezas);
router.post("/", piezaController.crearPieza);
router.put("/:id", piezaController.actualizarPieza);
router.delete("/:id", piezaController.eliminarPieza);

module.exports = router;