const db = require("../models");
const { enviarNotificacion } = require("../utils/websockets"); // 🔥 IMPORTACIÓN CORRECTA

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


// Un técnico de OT toma una tarea
exports.tomarTarea = async (req, res) => {
    try {
        const usuarioId = req.usuario.id; // Usuario que toma la tarea
        console.log("📌 Intentando tomar tarea:", req.params.id, "por usuario:", usuarioId);

        const tarea = await db.tareas.findByPk(req.params.id, {
            include: [{ model: db.usuarios, as: "usuario_solicitante" }] // Incluir el usuario que la creó
        });

        if (!tarea) {
            console.log("⚠️ Tarea no encontrada.");
            return res.status(404).json({ mensaje: "Tarea no encontrada" });
        }

        if (tarea.asignadoA) {
            console.log("⚠️ La tarea ya está asignada a otro técnico.");
            return res.status(400).json({ mensaje: "Esta tarea ya está asignada a otro técnico" });
        }

        tarea.asignadoA = usuarioId;
        tarea.estado = "En proceso";
        await tarea.save();

        // 🔹 Crear notificación para el técnico que tomó la tarea
        await db.notificaciones.create({
            usuarioId: tarea.asignadoA,
            mensaje: `Se te ha asignado la tarea #${tarea.id}.`,
            tipo: "tarea_asignada",
        });

        // 🔹 Crear notificación para el usuario que creó la tarea
        if (tarea.usuario_solicitante) {
            await db.notificaciones.create({
                usuarioId: tarea.usuario_solicitante.id,
                mensaje: `El técnico ${req.usuario.nombre} ha tomado tu tarea #${tarea.id}.`,
                tipo: "tarea_tomada",
            });

            // 🔥 Emitir evento de notificación en tiempo real para el usuario creador
            enviarNotificacion(tarea.usuario_solicitante.id, `El técnico ${req.usuario.nombre} ha tomado tu tarea #${tarea.id}`, "tarea_tomada");
        }

        console.log("✅ Tarea tomada exitosamente:", tarea);

        // 🔥 Emitir evento de notificación en tiempo real para el técnico que tomó la tarea
        enviarNotificacion(usuarioId, `Has tomado la tarea #${tarea.id}`, "tarea_tomada");

        return res.json({ mensaje: "Tarea tomada con éxito", tarea });

    } catch (error) {
        console.error("❌ ERROR al tomar la tarea:", error);
        return res.status(500).json({ mensaje: "Error al tomar la tarea", error });
    }
};

// Liberar una tarea para que otro la tome
exports.liberarTarea = async (req, res) => {
    try {
        const usuarioId = req.usuario.id;

        const tarea = await db.tareas.findByPk(req.params.id);
        if (!tarea || tarea.asignadoA !== usuarioId) {
            return res.status(403).json({ mensaje: "No puedes liberar esta tarea" });
        }

        tarea.asignadoA = null;
        tarea.estado = "Pendiente";
        await tarea.save();

        return res.json({ mensaje: "Tarea liberada con éxito", tarea });
    } catch (error) {
        return res.status(500).json({ mensaje: "Error al liberar la tarea", error });
    }
};

// Finalizar tarea
exports.finalizarTarea = async (req, res) => {
    try {
        const usuarioId = req.usuario.id;

        const tarea = await db.tareas.findByPk(req.params.id);
        if (!tarea || tarea.asignadoA !== usuarioId) {
            return res.status(403).json({ mensaje: "No puedes finalizar esta tarea" });
        }

        tarea.estado = "Finalizada";
        await tarea.save();
        // 🔹 Crear notificación cuando una tarea es finalizada
        await db.notificaciones.create({
            usuarioId: tarea.usuarioId,
            mensaje: `Tu tarea #${tarea.id} ha sido finalizada.`,
            tipo: "tarea_finalizada",
        });

        // 🔥 Emitir evento de notificación en tiempo real
        enviarNotificacion(tarea.usuarioId, `Tu tarea #${tarea.id} ha sido finalizada.`, "tarea_finalizada");        

        return res.json({ mensaje: "Tarea finalizada", tarea });
    } catch (error) {
        return res.status(500).json({ mensaje: "Error al finalizar la tarea", error });
    }
};

// Devolver una tarea al creador
exports.devolverTarea = async (req, res) => {
    try {
        const { motivo } = req.body;

        const tarea = await db.tareas.findByPk(req.params.id);
        if (!tarea) return res.status(404).json({ mensaje: "Tarea no encontrada" });

        await tarea.update({ estado: "Devuelta", motivoDevolucion: motivo });

        // 🔹 Crear notificación cuando una tarea es devuelta
        await db.notificaciones.create({
            usuarioId: tarea.usuarioId, // Se notifica al creador
            mensaje: `Tu tarea #${tarea.id} ha sido devuelta y necesita correcciones.`,
            tipo: "tarea_devuelta",
        });

        // 🔥 Emitir evento de notificación en tiempo real
        enviarNotificacion(tarea.usuarioId, `Tu tarea #${tarea.id} ha sido devuelta.`, "tarea_devuelta");        

        // Notificar al creador que su tarea ha sido devuelta
        return res.json({ mensaje: "Tarea devuelta al creador", tarea });
    } catch (error) {
        return res.status(500).json({ mensaje: "Error al devolver la tarea", error });
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
        const { id } = req.params;
        const { correccion } = req.body;
        const usuarioId = req.usuario.id;

        // 🔹 Buscar la tarea
        const tarea = await db.tareas.findByPk(id);

        if (!tarea) {
            return res.status(404).json({ mensaje: "Tarea no encontrada" });
        }

        // 🔹 Verificar que la tarea está devuelta y que el usuario es el comercial que la creó
        if (tarea.estado !== "Devuelta") {
            return res.status(403).json({ mensaje: "Solo se pueden corregir tareas devueltas" });
        }
        if (tarea.usuarioId !== usuarioId) {
            return res.status(403).json({ mensaje: "No tienes permiso para corregir esta tarea" });
        }

        // 🔥 Actualizar la tarea con la nueva descripción y devolverla a estado "Pendiente"
        await tarea.update({ correccionComercial: correccion, estado: "Pendiente", asignadoA: null, });

        res.json({ mensaje: "✅ Tarea corregida con éxito" });
    } catch (error) {
        console.error("❌ Error al corregir la tarea:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};
