const express = require("express");
const router = express.Router();
const filialController = require("../controllers/filialController");
const { esGerente } = require("../../../../middlewares/rolMiddleware")
const { verificarToken } = require("../../../../middlewares/authMiddleware")

// 📌 Rutas protegidas solo para Gerencia
router.get("/", filialController.obtenerFiliales);
router.post("/", filialController.crearFilial);
router.put("/:id", filialController.actualizarFilial);
router.delete("/:id", filialController.eliminarFilial);

module.exports = router;