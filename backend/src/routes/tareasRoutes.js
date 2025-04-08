const express = require("express");
const router = express.Router();
const { verificarToken } = require("../middlewares/authMiddleware");
const tareasController = require("../controllers/tareas/tareasController");

// 📌 Crear una nueva tarea
router.post("/", verificarToken, tareasController.registrarTarea);

// 📌 Obtener todas las tareas
router.get("/", verificarToken, tareasController.obtenerTareas);

// 📌 Obtener una tarea por ID
router.get("/:id", verificarToken, tareasController.obtenerTareaPorId);
// 📌 Obtener tareas devueltas para corrección
router.get("/devueltas", verificarToken, tareasController.obtenerTareasDevueltas);

// 📌 Actualizar una tarea (Ejemplo: cambiar estado)
router.put("/:id/tomar", verificarToken, tareasController.tomarTarea);
router.put("/:id/liberar", verificarToken, tareasController.liberarTarea);
router.put("/:id/finalizar", verificarToken, tareasController.finalizarTarea);
router.put("/:id/devolver", verificarToken, tareasController.devolverTarea);
router.put("/:id/cancelar", verificarToken, tareasController.cancelarTarea);
// 🔹 Ruta para corregir una tarea devuelta
router.put("/:id/corregir", verificarToken, tareasController.corregirTarea);

// 📌 Eliminar una tarea
router.delete("/:id", verificarToken, tareasController.eliminarTarea);

module.exports = router;