const express = require("express");
const router = express.Router();
const {
   verificarToken,
} = require("../../../../shared/middlewares/authMiddleware");
const VacacionesController = require("../controllers/vacacionesController");

router.use(verificarToken); // Verificamos el token para todas las rutas

router.post("/crear", VacacionesController.crearVacaciones);
router.get("/", VacacionesController.obtenerVacacionesTrabajadores);

module.exports = router;
