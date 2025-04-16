const express = require("express");
const router = express.Router();
const filialController = require("../controllers/filialController");
const { esGerente } = require("../../../../middlewares/rolMiddleware")

// 📌 Rutas protegidas solo para Gerencia
router.get("/", esGerente, filialController.obtenerFiliales);
router.post("/", esGerente, filialController.crearFilial);
router.put("/:id", esGerente, filialController.actualizarFilial);
router.delete("/:id", esGerente, filialController.eliminarFilial);

module.exports = router;