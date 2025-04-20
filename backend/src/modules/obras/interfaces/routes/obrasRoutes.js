const express = require("express");
const router = express.Router();
const obraController = require("../controllers/obraController");
const { verificarToken } = require("../../../../middlewares/authMiddleware");

// 📌 Rutas protegidas solo para Gerencia
router.get("/", verificarToken, obraController.obtenerObras);
router.post("/", verificarToken, obraController.crearObra);
router.put("/:id", verificarToken, obraController.actualizarObra);
router.delete("/:id", verificarToken, obraController.eliminarObra);

module.exports = router;