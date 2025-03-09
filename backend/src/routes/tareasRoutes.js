const express = require("express");
const router = express.Router();
const { verificarToken } = require("../middlewares/authMiddleware");
const tareasController = require("../controllers/tareasController");

// 📌 Crear una nueva tarea
router.post("/", verificarToken, tareasController.registrarTarea);

// 📌 Obtener todas las tareas
router.get("/", verificarToken, tareasController.obtenerTareas);

// 📌 Obtener una tarea por ID
router.get("/:id", verificarToken, tareasController.obtenerTareaPorId);

// 📌 Actualizar una tarea (Ejemplo: cambiar estado)
router.put("/:id", verificarToken, tareasController.actualizarTarea);

// 📌 Eliminar una tarea
router.delete("/:id", verificarToken, tareasController.eliminarTarea);

module.exports = router;