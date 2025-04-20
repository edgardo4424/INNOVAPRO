const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");
const { esGerente } = require("../../../../middlewares/rolMiddleware")
const { verificarToken } =require("../../../../middlewares/authMiddleware")

// 📌 Rutas protegidas solo para Gerencia
router.get("/", verificarToken, esGerente, usuarioController.obtenerUsuarios);
router.post("/",verificarToken, esGerente, usuarioController.crearUsuario);
router.put("/:id", verificarToken, esGerente, usuarioController.actualizarUsuario);
router.delete("/:id", verificarToken, esGerente, usuarioController.eliminarUsuario);

module.exports = router;