const express = require("express");
const router = express.Router();
const tareaController = require("../controllers/tareaController");
const { verificarToken } = require("../../../../shared/middlewares/authMiddleware");

router.use(verificarToken); // Middleware para verificar el token JWT

// 📌 Crear una nueva tarea
router.post("/", tareaController.crearTarea);

// 📌 Obtener todas las tareas
router.get("/", tareaController.obtenerTareas);

// 📌 Obtener una tarea por ID
router.get("/:id", tareaController.obtenerTareaPorId);

// 📌 Actualizar una tarea (Ejemplo: cambiar estado)

router.put("/:id/tomar", tareaController.tomarTarea);
router.put("/:id/liberar", tareaController.liberarTarea);
router.put("/:id/finalizar", tareaController.finalizarTarea);
router.put("/:id/cancelar", tareaController.cancelarTarea);
router.put("/:id/devolver", tareaController.devolverTarea);

// 🔹 Ruta para corregir una tarea devuelta
router.put("/:id/corregir", tareaController.corregirTarea);

// 📌 Eliminar una tarea
router.delete("/:id", tareaController.eliminarTarea);

module.exports = router;