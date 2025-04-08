const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");
const { esGerente } = require("../middlewares/rolMiddleware");

// 📌 Rutas protegidas solo para Gerencia
router.get("/", esGerente, usuarioController.obtenerUsuarios);
router.post("/", esGerente, usuarioController.crearUsuario);
router.put("/:id", esGerente, usuarioController.actualizarUsuario);
router.delete("/:id", esGerente, usuarioController.eliminarUsuario);

module.exports = router;