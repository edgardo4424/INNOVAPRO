const db = require("../../models");
const Cliente = db.clientes;
const Obra = db.obras; 
const Contacto = db.contactos;
const contactoService = require("../../services/contactoService");

// 🔹 Obtener todos los contactos
exports.obtenerContactos = async (req, res) => {
    try {
        const contactos = await Contacto.findAll({
             
            include: [
                {
                    model: Cliente,
                    through: { attributes: [] }, 
                    as: "clientes_asociados",
                    attributes: ["id", "razon_social"] // 🔥 Solo obtener los atributos necesarios
                },
                {
                    model: Obra,
                    through: { attributes: [] }, 
                    as: "obras_asociadas",
                    attributes: ["id", "nombre"] // 🔥 Solo obtener los atributos necesarios
                },
            ],
        });

        res.status(200).json(contactos);
    } catch (error) {
        console.error("❌ Error al obtener contactos:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

// 🔹 Obtener contactos por ID
exports.obtenerContactoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const contacto = await Contacto.findByPk(id, {
            include: [
                { model: Cliente, as: "clientes_asociados" },
                { model: Obra, as: "obras_asociadas" }
            ]
        });

        if (!contacto) {
            return res.status(404).json({ error: "Contacto no encontrado" });
        }

        res.json(contacto);
    } catch (error) {
        console.error("❌ Error al obtener contacto:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// 🔹 Crear un nuevo contacto
exports.crearContacto = async (req, res) => {
    try {
            const nuevoContacto = await contactoService.crearContactoConRelaciones(req.body);
            res.status(201).json({ mensaje: "✅ Contacto creado con éxito", contacto: nuevoContacto });
    } catch (error) {
        console.error("❌ Error al crear contacto:", error);
        const status = error.status || 500;
        res.status(status).json({ mensaje: error.mensaje || "Error interno del servidor" });
    }
};

// 🔹 Actualizar un contacto
exports.actualizarContacto = async (req, res) => {
    try {
        const contactoActualizado = await contactoService.actualizarContactoConRelaciones(req.params.id, req.body);
        res.json({ mensaje: "✅ Contacto actualizado correctamente", contacto: contactoActualizado });
    } catch (error) {
        console.error("❌ Error al actualizar contacto:", error);
        const status = error.status || 500;
        res.status(status).json({ mensaje: error.mensaje || "Error interno del servidor" });
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