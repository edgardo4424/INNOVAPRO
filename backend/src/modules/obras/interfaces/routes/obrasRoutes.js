const express = require("express");
const router = express.Router();
const obraController = require("../controllers/obraController");
const { verificarToken } = require("../../../../shared/middlewares/authMiddleware");

router.use(verificarToken); // Verificamos el token para todas las rutas

// 📌 Rutas protegidas solo para Gerencia
router.get("/", obraController.obtenerObras);
router.get("/:id", obraController.obtenerObraPorId);
router.post("/", obraController.crearObra);
router.put("/:id", obraController.actualizarObra);
router.delete("/:id", obraController.eliminarObra);

module.exports = router;