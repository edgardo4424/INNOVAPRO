const express = require("express");
const router = express.Router();
const cotizacionController = require("../controllers/cotizacionController");
const { verificarToken } = require("../../../../shared/middlewares/authMiddleware");

router.use(verificarToken); // Verificamos el token para todas las rutas

// 📌 Rutas protegidas solo para Gerencia
router.get("/", cotizacionController.obtenerCotizaciones);
router.post("/", cotizacionController.crearCotizacion);

/* router.put("/:id", cotizacionController.actualizarCotizacion);
router.delete("/:id", cotizacionController.eliminarCotizacion); */

module.exports = router;