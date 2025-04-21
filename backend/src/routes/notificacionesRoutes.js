const express = require("express");
const router = express.Router();
const { obtenerNotificaciones, marcarComoLeida } = require("../controllers/notificacionesController");
const { verificarToken } = require("../shared/middlewares/authMiddleware");

// 🔹 Obtener notificaciones del usuario autenticado
router.get("/", verificarToken, obtenerNotificaciones);

// 🔹 Marcar una notificación como leída
router.put("/:id/leida", verificarToken, marcarComoLeida);

module.exports = router;