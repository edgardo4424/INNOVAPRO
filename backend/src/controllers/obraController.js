const db = require("../models");

// 🔹 Obtener todas las obras
exports.obtenerObras = async (req, res) => {
    try {
        if (!db.obras) {
            return res.status(500).json({ mensaje: "Error interno: Modelo de Obras no encontrado." });
        }
        const obras = await db.obras.findAll();
        res.status(200).json(obras);
    } catch (error) {
        console.error("❌ Error al obtener obras:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

// 🔹 Obtener una obra por ID
exports.obtenerObraPorId = async (req, res) => {
    try {
        const obra = await db.obras.findByPk(req.params.id);
        if (!obra) return res.status(404).json({ mensaje: "Obra no encontrada" });

        res.status(200).json(obra);
    } catch (error) {
        console.error("❌ Error al obtener obra:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

// 🔹 Crear una nueva obra
exports.crearObra = async (req, res) => {
    try {

        if (!req.usuario) {
            return res.status(403).json({ error: "Usuario no autenticado" });
        }

        const { nombre, direccion, ubicacion, estado } = req.body;

        if (!nombre || !direccion || !ubicacion || !estado) {
            return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
        }

        const nuevaObra = await db.obras.create({
            nombre,
            direccion,
            ubicacion,
            estado,
            creado_por: req.usuario.id,  // 🔥 Ahora se asigna correctamente el usuario creador
        });

        res.status(201).json({ mensaje: "Obra creada exitosamente", obra: nuevaObra });
    } catch (error) {
        console.error("❌ Error al crear obra:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

// 🔹 Actualizar una obra
exports.actualizarObra = async (req, res) => {
    try {
        const { nombre, direccion, ubicacion, estado } = req.body;
        const obra = await db.obras.findByPk(req.params.id);

        if (!obra) return res.status(404).json({ mensaje: "Obra no encontrada" });

        await obra.update({ nombre, direccion, ubicacion, estado });
        res.status(200).json({ mensaje: "Obra actualizada correctamente", obra });
    } catch (error) {
        console.error("❌ Error al actualizar obra:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

// 🔹 Eliminar una obra
exports.eliminarObra = async (req, res) => {
    try {
        const obra = await db.obras.findByPk(req.params.id);
        if (!obra) return res.status(404).json({ mensaje: "Obra no encontrada" });

        await obra.destroy();
        res.status(200).json({ mensaje: "Obra eliminada correctamente" });
    } catch (error) {
        console.error("❌ Error al eliminar obra:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};