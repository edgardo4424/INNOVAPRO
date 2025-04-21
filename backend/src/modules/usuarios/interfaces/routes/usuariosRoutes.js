const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");
const { esGerente } = require("../../../../shared/middlewares/rolMiddleware")
const { verificarToken } =require("../../../../shared/middlewares/authMiddleware")

router.use(verificarToken, esGerente); // Verificamos el token y el rol de Gerente para todas las rutas

// 📌 Rutas protegidas solo para Gerencia
router.get("/", usuarioController.obtenerUsuarios);
router.get("/:id", usuarioController.obtenerUsuarioPorId);
router.post("/", usuarioController.crearUsuario);
router.put("/:id",  usuarioController.actualizarUsuario);
router.delete("/:id", usuarioController.eliminarUsuario);

module.exports = router;