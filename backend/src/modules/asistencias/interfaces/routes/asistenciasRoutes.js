const express = require("express");
const router = express.Router();
const {
   verificarToken,
} = require("../../../../shared/middlewares/authMiddleware");
const AsistenciaController = require("../controllers/asistenciaController");

router.use(verificarToken); // Verificamos el token para todas las rutas

router.post("/", AsistenciaController.crearAsistencia);
router.put("/", AsistenciaController.actualizarAsistencia);
router.post("/simple", AsistenciaController.crearAsistenciaSimple);
router.put("/simple", AsistenciaController.actualizarAsistenciaSimple);
router.post("/faltas-por-trabajador", AsistenciaController.obtenerFaltasPorRangoFecha);

module.exports = router;
