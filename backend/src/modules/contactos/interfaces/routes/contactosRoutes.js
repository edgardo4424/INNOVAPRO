const express = require("express");
const router = express.Router();
const contactoController = require("../controllers/contactoController");
const { verificarToken } = require("../../../../shared/middlewares/authMiddleware");

router.use(verificarToken); // Verificamos el token para todas las rutas

// 📌 Rutas de contactos (protegidas por token desde index.js)
router.get("/", contactoController.obtenerContactos);
router.get("/:id", contactoController.obtenerContactoPorId);
router.post("/", contactoController.crearContacto);
router.put("/:id", contactoController.actualizarContacto);
router.delete("/:id", contactoController.eliminarContacto);

module.exports = router;