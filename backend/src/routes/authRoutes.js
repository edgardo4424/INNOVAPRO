const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");
const { verificarToken } = require("../middlewares/authMiddleware");

// 📌 Login de usuario (sin token)
router.post("/login", usuarioController.login);

// 📌 Verificar sesión válida (con token)
router.get("/verify-session", verificarToken, (req, res) => {
  res.json({ valid: true });
});

module.exports = router;