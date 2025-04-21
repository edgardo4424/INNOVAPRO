const express = require("express");
const router = express.Router();
const filialController = require("../controllers/filialController");
const { esGerente } = require("../../../../shared/middlewares/rolMiddleware")
const { verificarToken } = require("../../../../shared/middlewares/authMiddleware");

router.use(verificarToken, esGerente); // Verificamos el token y el rol de Gerente para todas las rutas

// 📌 Rutas protegidas solo para Gerencia
router.get("/", filialController.obtenerFiliales);
router.post("/", filialController.crearFilial);
router.put("/:id", filialController.actualizarFilial);
router.delete("/:id", filialController.eliminarFilial);

module.exports = router;