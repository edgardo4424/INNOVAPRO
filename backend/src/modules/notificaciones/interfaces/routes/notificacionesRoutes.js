const express = require("express");
const router = express.Router();
const NotificacionController = require("../controllers/notificacionController");
const { verificarToken } = require("../../../../shared/middlewares/authMiddleware");

router.use(verificarToken); // Middleware para verificar el token JWT

router.get("/", NotificacionController.listar); // Obtener todas las notificaciones
router.put("/:id/leida", NotificacionController.marcarComoLeida); // Marcar una notificación como leída

module.exports = router;