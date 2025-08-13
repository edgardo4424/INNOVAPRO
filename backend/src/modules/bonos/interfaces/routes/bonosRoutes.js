const express = require("express");
const router = express.Router();

const { verificarToken } = require("../../../../shared/middlewares/authMiddleware");
const   BonosController = require("../controllers/bonosController");

router.use(verificarToken); // Verificamos el token para todas las rutas

// 📌 Rutas de Bonos (protegidas por token desde index.js)
router.post("/", BonosController.crearBono);
router.put("/", BonosController.editarBono);
router.post("/rango", BonosController.obtenerBonosDelTrabajadorEnRango);
router.get("/", BonosController.obtenerBonos);
router.get("/:id", BonosController.obtenerBonosPorTrabajadorId);
router.delete("/:id", BonosController.eliminarBonoPorId);

module.exports = router;