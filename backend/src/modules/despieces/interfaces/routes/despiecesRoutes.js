const express = require("express");
const router = express.Router();
const despieceController = require("../controllers/despieceController");
const { verificarToken } = require("../../../../shared/middlewares/authMiddleware");

router.use(verificarToken); // Verificamos el token para todas las rutas

// 📌 Rutas protegidas solo para Gerencia
router.get("/", despieceController.obtenerDespieces);
router.post("/", despieceController.crearDespiece);
router.put("/:id", despieceController.actualizarDespiece);
router.delete("/:id", despieceController.eliminarDespiece);
router.post("/andamio-de-fachada", despieceController.generarDespieceAndamioDeFachada)
router.post("/andamio-de-trabajo", despieceController.generarDespieceAndamioDeTrabajo)
router.post("/puntales", despieceController.generarDespiecePuntales)
router.post("/escalera-de-acceso", despieceController.generarDespieceEscalera)
router.post("/plataforma-de-descarga", despieceController.generarDespiecePlataformaDescarga)
router.post("/escuadras", despieceController.generarDespieceEscuadras)
router.post("/andamio-fachada", despieceController.generarDespiecePuntales)

module.exports = router;