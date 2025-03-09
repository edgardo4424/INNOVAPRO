const db = require("../models");

// 🔹 Registrar una nueva tarea
exports.registrarTarea = async (req, res) => {
    try {
                
        const { empresaProveedoraId, clienteId, obraId, tipoTarea, urgencia, detalles } = req.body;

        if (!empresaProveedoraId || !clienteId || !obraId || !tipoTarea || !urgencia) {
            return res.status(400).json({ mensaje: "Todos los campos son obligatorios." });
        }

        if (!req.usuario || !req.usuario.id) {
            return res.status(401).json({ mensaje: "Usuario no autenticado." });
        }

        const obra = await db.obras.findByPk(obraId);
        if (!obra) {
            return res.status(404).json({ mensaje: "Obra no encontrada." });
        }

        // 🔥 Guardamos `detalles` en la base de datos
        const nuevaTarea = await db.tareas.create({
            usuarioId: req.usuario.id,
            empresaProveedoraId,
            clienteId,
            obraId,
            ubicacion: obra.ubicacion,
            tipoTarea,
            urgencia,
            estado: "Pendiente",
            detalles: detalles ? detalles : {}, // ✅ Aseguramos que `detalles` no sea undefined
        });

        res.status(201).json({ mensaje: "✅ Tarea registrada con éxito", tarea: nuevaTarea });
    } catch (error) {
        console.error("❌ Error al registrar tarea:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};


// 🔹 Obtener todas las tareas
exports.obtenerTareas = async (req, res) => {
    try {
        const tareas = await db.tareas.findAll({
            include: [
                { model: db.usuarios, as: "usuario_solicitante", attributes: ["id", "nombre"] },
                { model: db.empresas_proveedoras, as: "empresa_proveedora", attributes: ["id", "razon_social"] },
                { model: db.clientes, as: "cliente", attributes: ["id", "razon_social"] },
                { model: db.obras, as: "obra", attributes: ["id", "nombre"] },
            ],
        });
        res.status(200).json(tareas);
    } catch (error) {
        console.error("❌ Error al obtener tareas:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

// 🔹 Obtener tarea por ID
exports.obtenerTareaPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const tarea = await db.tareas.findByPk(id, {
            include: [
                { model: db.usuarios, as: "usuario_solicitante", attributes: ["id", "nombre"] },
                { model: db.empresas_proveedoras, as: "empresa_proveedora", attributes: ["id", "razon_social"] },
                { model: db.clientes, as: "cliente", attributes: ["id", "razon_social"] },
                { model: db.obras, as: "obra", attributes: ["id", "nombre"] },
            ],
        });

        if (!tarea) {
            return res.status(404).json({ mensaje: "Tarea no encontrada" });
        }

        res.json(tarea);
    } catch (error) {
        console.error("❌ Error al obtener tarea:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

// 🔹 Actualizar tarea
exports.actualizarTarea = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    try {
        const tarea = await db.tareas.findByPk(id);
        if (!tarea) {
            return res.status(404).json({ mensaje: "Tarea no encontrada" });
        }

        await tarea.update({ estado });
        res.json({ mensaje: "✅ Tarea actualizada correctamente", tarea });
    } catch (error) {
        console.error("❌ Error al actualizar tarea:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

// 🔹 Eliminar tarea
exports.eliminarTarea = async (req, res) => {
    try {
        const tarea = await db.tareas.findByPk(req.params.id);
        if (!tarea) return res.status(404).json({ mensaje: "Tarea no encontrada" });

        await tarea.destroy();
        res.status(200).json({ mensaje: "Tarea eliminada correctamente" });
    } catch (error) {
        console.error("❌ Error al eliminar tarea:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};