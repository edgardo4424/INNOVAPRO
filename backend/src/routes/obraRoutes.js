const express = require("express");
const router = express.Router();
const obraController = require("../controllers/clientes/obraController");

// 📌 Rutas de obras (protegidas por token desde index.js)
router.get("/", obraController.obtenerObras);
router.get("/:id", obraController.obtenerObraPorId);
router.post("/", obraController.crearObra);
router.put("/:id", obraController.actualizarObra);
router.delete("/:id", obraController.eliminarObra);

module.exports = router;