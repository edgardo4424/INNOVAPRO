const db = require("../models");

// 🔹 Obtener todos los clientes con sus obras y contactos asociados
exports.obtenerClientes = async (req, res) => {
    try {
        const clientes = await db.clientes.findAll({
            include: [
                {
                    model: db.obras, 
                    as: "obras",
                    duplicating: false, // 🔥 Evita la duplicación
                    required: false // 🔹 Asegura que se muestren clientes aunque no tengan obras
                },
                {model: db.contactos, as: "contactos"}
            ]
        });
        res.status(200).json(clientes);
    } catch (error) {
        console.error("❌ Error al obtener clientes:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

// 🔹 Obtener un cliente por ID
exports.obtenerClientePorId = async (req, res) => {
    try {
        const cliente = await db.clientes.findByPk(req.params.id);
        if (!cliente) {
            return res.status(404).json({ mensaje: "Cliente no encontrado" });
        }
        res.status(200).json(cliente);
    } catch (error) {
        console.error("❌ Error al obtener cliente:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

// 🔹 Crear un nuevo cliente
exports.crearCliente = async (req, res) => {
    try {
        const { razon_social, ruc, domicilio_fiscal, representante_legal, dni_representante, creado_por } = req.body;

        if (!razon_social || !ruc || !domicilio_fiscal || !representante_legal || !dni_representante || !creado_por) {
            return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
        }

        const nuevoCliente = await db.clientes.create({
            razon_social, ruc, domicilio_fiscal, representante_legal, dni_representante, creado_por
        });

        res.status(201).json({ mensaje: "Cliente creado exitosamente", cliente: nuevoCliente });
    } catch (error) {
        console.error("❌ Error al crear cliente:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

// 🔹 Actualizar un cliente
exports.actualizarCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const cliente = await db.Cliente.findByPk(id);

        if (!cliente) {
            return res.status(404).json({ mensaje: "Cliente no encontrado" });
        }

        await cliente.update(req.body);
        res.status(200).json({ mensaje: "Cliente actualizado correctamente", cliente });
    } catch (error) {
        console.error("❌ Error al actualizar cliente:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

// 🔹 Eliminar un cliente
exports.eliminarCliente = async (req, res) => {
    try {
        const { id } = req.params;

        const cliente = await db.Cliente.findByPk(id);
        if (!cliente) {
            return res.status(404).json({ mensaje: "Cliente no encontrado" });
        }

        await cliente.destroy();
        res.status(200).json({ mensaje: "Cliente eliminado correctamente" });
    } catch (error) {
        console.error("❌ Error al eliminar cliente:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};
