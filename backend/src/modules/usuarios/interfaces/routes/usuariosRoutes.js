const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");
const { esGerente } = require("../../../../shared/middlewares/rolMiddleware")
const { verificarToken } =require("../../../../shared/middlewares/authMiddleware")

router.use(verificarToken); // Verificamos el token y el rol de Gerente para todas las rutas

// 📌 Rutas protegidas solo para Gerencia
router.get("/", esGerente, usuarioController.obtenerUsuarios);
router.get("/:id", esGerente, usuarioController.obtenerUsuarioPorId);
router.post("/", esGerente, usuarioController.crearUsuario);
router.put("/:id", esGerente, usuarioController.actualizarUsuario);
router.delete("/:id", esGerente, usuarioController.eliminarUsuario);

//router.put("/:id/telegram", usuarioController.actualizarIdChatTelegramUsuario)

module.exports = router;