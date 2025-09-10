const express = require("express");
const router = express.Router();
const {
   verificarToken,
} = require("../../../../shared/middlewares/authMiddleware");
const TrabajadorController = require("../controllers/trabajadorController");

router.use(verificarToken); // Verificamos el token para todas las rutas

router.post("/crear", TrabajadorController.crearTrabajador);
router.get("/filial/:id/:fecha", TrabajadorController.obtenerTrabajadoresPorArea);
router.get("/", TrabajadorController.obtenerTrabajadores);
router.post("/", TrabajadorController.crearTrabajadorConContrato);
router.put("/", TrabajadorController.editarTrabajadorConContrato);
router.get("/trabajadores-contratos", TrabajadorController.obtenerTrabajadoresYcontratos);
router.post("/contratos-vigentes", TrabajadorController.obtenerTrabajadoresConContratosVigentes);
router.get("/:id", TrabajadorController.obtenerTrabajadorPorId);

module.exports = router;
