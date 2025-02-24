const db = require("../models");

// 🔹 Obtener todos los contactos
exports.obtenerContactos = async (req, res) => {
    try {
        const contactos = await db.contactos.findAll();
        res.status(200).json(contactos);
    } catch (error) {
        console.error("❌ Error al obtener contactos:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

// 🔹 Obtener contactos por obra ID
exports.obtenerContactosPorObra = async (req, res) => {
    try {
        const { obraId } = req.params;
        if (!obraId) return res.status(400).json({ mensaje: "Obra ID es requerido" });

        const contactos = await db.Contacto.findAll({ where: { obra_id: obraId } });
        res.status(200).json(contactos);
    } catch (error) {
        console.error("❌ Error al obtener contactos por obra:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

// 🔹 Obtener un contacto por ID
exports.obtenerContactoPorId = async (req, res) => {
    try {
        const contacto = await db.cotanctos.findByPk(req.params.id);
        if (!contacto) return res.status(404).json({ mensaje: "Contacto no encontrado" });

        res.status(200).json(contacto);
    } catch (error) {
        console.error("❌ Error al obtener contacto:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

// 🔹 Crear un nuevo contacto
exports.crearContacto = async (req, res) => {
    try {
        const { nombre, email, telefono, cargo, cliente_id, obra_id } = req.body;

        if (!nombre || !email || !cliente_id || !obra_id) {
            return res.status(400).json({ mensaje: "Todos los campos obligatorios deben ser completados" });
        }

        const nuevoContacto = await db.contactos.create({ nombre, email, telefono, cargo, cliente_id, obra_id });
        res.status(201).json({ mensaje: "Contacto creado exitosamente", contacto: nuevoContacto });
    } catch (error) {
        console.error("❌ Error al crear contacto:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

// 🔹 Actualizar un contacto
exports.actualizarContacto = async (req, res) => {
    try {
        const { nombre, email, telefono, cargo } = req.body;
        const contacto = await db.contactos.findByPk(req.params.id);

        if (!contacto) return res.status(404).json({ mensaje: "Contacto no encontrado" });

        await contacto.update({ nombre, email, telefono, cargo });
        res.status(200).json({ mensaje: "Contacto actualizado correctamente", contacto });
    } catch (error) {
        console.error("❌ Error al actualizar contacto:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

// 🔹 Eliminar un contacto
exports.eliminarContacto = async (req, res) => {
    try {
        const contacto = await db.contactos.findByPk(req.params.id);
        if (!contacto) return res.status(404).json({ mensaje: "Contacto no encontrado" });

        await contacto.destroy();
        res.status(200).json({ mensaje: "Contacto eliminado correctamente" });
    } catch (error) {
        console.error("❌ Error al eliminar contacto:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};