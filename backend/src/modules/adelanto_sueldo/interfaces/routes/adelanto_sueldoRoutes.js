const express = require("express");
const router = express.Router();

const {
   verificarToken,
} = require("../../../../shared/middlewares/authMiddleware");
const AdelantoSueldoController = require("../controllers/adelantosController");

router.use(verificarToken); // Verificamos el token para todas las rutas

// 📌 Rutas de Bonos (protegidas por token desde index.js)
router.post("/", AdelantoSueldoController.crearAdelantoSueldo);
router.put("/", AdelantoSueldoController.editarAdelantoSueldo);
router.post("/rango", AdelantoSueldoController.obtenerAdelantosDelTrabajadorEnRango);
router.get("/", AdelantoSueldoController.obtenerAdelantos);
router.get("/:id", AdelantoSueldoController.obtenerAdelantosPorTrabajadorId);
router.delete("/:id", AdelantoSueldoController.eliminarAdelantoSueldoPorId);

module.exports = router;
   