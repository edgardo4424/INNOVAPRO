const db = require("../../models")
const tareaService = require("../../services/tareaService");

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
                { model: db.usuarios, as: "tecnico_asignado", attributes: ["id", "nombre"] },
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

// 🔹 Obtener tareas devueltas para corregir
exports.obtenerTareasDevueltas = async (req, res) => {
    try {
        const usuarioId = req.usuario.id; // Obtener el ID del usuario autenticado
        const tareas = await db.tareas.findAll({
            where: { usuario_solicitante: usuarioId, estado: "Devuelta" },
            include: [
                { model: db.clientes, as: "cliente" },
                { model: db.obras, as: "obra" }
            ],
            order: [["updatedAt", "DESC"]],
        });

        res.json(tareas);
    } catch (error) {
        console.error("❌ Error al obtener tareas devueltas:", error);
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


// Un técnico de OT toma una tarea
exports.tomarTarea = async (req, res) => {
    try {
        const tarea = await tareaService.tomarTarea(req.params.id, req.usuario);
        res.json({ mensaje: "Tarea tomada con éxito", tarea });
    } catch (error) {
        console.error("❌ ERROR al tomar la tarea:", error);
        res.status(error.status || 500).json({ mensaje: error.mensaje || "Error al tomar la tarea" });
    }
};

// Liberar una tarea para que otro la tome
exports.liberarTarea = async (req, res) => {
    try {
        const tarea = await tareaService.liberarTarea(req.params.id, req.usuario);
        return res.json({ mensaje: "Tarea liberada con éxito", tarea });
    } catch (error) {
        console.error("❌ ERROR al liberar la tarea:", error);
        res.status(error.status || 500).json({ mensaje: error.mensaje || "Error al liberar la tarea" });
    }
};

// Finalizar tarea
exports.finalizarTarea = async (req, res) => {
    try {
        const tarea = await tareaService.finalizarTarea(req.params.id, req.usuario);      
        return res.json({ mensaje: "Tarea finalizada", tarea });
    } catch (error) {
        console.error("❌ ERROR al finalizar la tarea:", error);
        res.status(error.status || 500).json({ mensaje: error.mensaje || "Error al finalizar la tarea" });
    }
};

// Devolver una tarea al creador
exports.devolverTarea = async (req, res) => {
    try {
        let motivo = req.body.motivo;
        if (typeof motivo !== "string") {
            motivo = req.body.motivo?.value || JSON.stringify(req.body.motivo);
        }

        const tarea = await tareaService.devolverTarea(req.params.id, motivo);     
        return res.json({ mensaje: "Tarea devuelta al creador", tarea });
    } catch (error) {
        console.error("❌ ERROR al devolver la tarea:", error);
        res.status(error.status || 500).json({ mensaje: error.mensaje || "Error al devolver la tarea" });
    }
};

// Cancelar una tarea completamente
exports.cancelarTarea = async (req, res) => {
    try {

        const tarea = await db.tareas.findByPk(req.params.id);
        if (!tarea) return res.status(404).json({ mensaje: "Tarea no encontrada" });

        tarea.estado = "Cancelada";
        await tarea.save();

        return res.json({ mensaje: "Tarea cancelada", tarea });
    } catch (error) {
        return res.status(500).json({ mensaje: "Error al cancelar la tarea", error });
    }
};

// 🔥 Función para corregir una tarea devuelta
exports.corregirTarea = async (req, res) => {
    try {

        let correccion = req.body.correccion;
        if (typeof correccion !== "string") {
            correccion = req.body.correccion?.value || JSON.stringify(req.body.correccion);
        }

        const tarea = await tareaService.corregirTarea(req.params.id, correccion, req.usuario.id);

        res.json({ mensaje: "✅ Tarea corregida con éxito", tarea });
    } catch (error) {
        console.error("❌ ERROR al corregir la tarea:", error);
        res.status(error.status || 500).json({ mensaje: error.mensaje || "Error al corregir la tarea" });
    }
};
