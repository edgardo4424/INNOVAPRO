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


// 🔹 Obtener obras por cliente ID
exports.obtenerObrasPorCliente = async (req, res) => {
    try {
        const { clienteId } = req.params;
        if (!clienteId) return res.status(400).json({ mensaje: "Cliente ID es requerido" });

        const obras = await db.Obra.findAll({ where: { cliente_id: clienteId } });
        res.status(200).json(obras);
    } catch (error) {
        console.error("❌ Error al obtener obras por cliente:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

// 🔹 Obtener una obra por ID
exports.obtenerObraPorId = async (req, res) => {
    try {
        const obra = await db.Obras.findByPk(req.params.id);
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
        const { nombre, direccion, ubicacion, cliente_id } = req.body;

        if (!nombre || !direccion || !ubicacion || !cliente_id) {
            return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
        }

        const nuevaObra = await db.Obra.create({ nombre, direccion, ubicacion, cliente_id });
        res.status(201).json({ mensaje: "Obra creada exitosamente", obra: nuevaObra });
    } catch (error) {
        console.error("❌ Error al crear obra:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

// 🔹 Actualizar una obra
exports.actualizarObra = async (req, res) => {
    try {
        const { nombre, direccion, ubicacion } = req.body;
        const obra = await db.Obra.findByPk(req.params.id);

        if (!obra) return res.status(404).json({ mensaje: "Obra no encontrada" });

        await obra.update({ nombre, direccion, ubicacion });
        res.status(200).json({ mensaje: "Obra actualizada correctamente", obra });
    } catch (error) {
        console.error("❌ Error al actualizar obra:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

// 🔹 Eliminar una obra
exports.eliminarObra = async (req, res) => {
    try {
        const obra = await db.Obra.findByPk(req.params.id);
        if (!obra) return res.status(404).json({ mensaje: "Obra no encontrada" });

        await obra.destroy();
        res.status(200).json({ mensaje: "Obra eliminada correctamente" });
    } catch (error) {
        console.error("❌ Error al eliminar obra:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};