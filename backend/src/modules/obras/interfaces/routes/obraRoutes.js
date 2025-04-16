const express = require("express");
const router = express.Router();
const obraController = require("../controllers/obraController");

// 📌 Rutas protegidas solo para Gerencia
router.get("/", obraController.obtenerObras);
router.post("/", obraController.crearObra);
router.put("/:id", obraController.actualizarObra);
router.delete("/:id", obraController.eliminarObra);

module.exports = router;