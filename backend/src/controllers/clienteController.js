const db = require("../models");
const Cliente = db.clientes;
const Contacto = db.contactos; 

// 🔹 Obtener todos los clientes con sus obras y contactos
exports.obtenerClientes = async (req, res) => {
    try {
        const clientes = await Cliente.findAll({
            attributes: [
                "id", "razon_social", "tipo", "ruc", "dni", "telefono", "email", 
                "domicilio_fiscal", "representante_legal", "dni_representante", "creado_por", "fecha_creacion"
            ],
            include: [
                {
                    model: Contacto,
                    through: { attributes: [] }, // ✅ Relación correcta con la tabla intermedia
                    as: "contactos_asociados",
                },
            ],
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
        const { razon_social, tipo, ruc, dni, domicilio_fiscal, representante_legal, dni_representante, telefono, email, creado_por } = req.body;

        if (!razon_social || !tipo || !creado_por) {
            return res.status(400).json({ mensaje: "Razón social, tipo y usuario creador son obligatorios." });
        }

        let nuevoClienteData = {
            razon_social,
            tipo,
            telefono: telefono || "",  // 🔥 Si es null, se guarda como ""
            email: email || "",
            creado_por,
        };

        // 🔥 Si el cliente es una Empresa, validamos y asignamos los campos extra
        if (tipo === "Empresa") {
            if (!ruc || !domicilio_fiscal || !representante_legal || !dni_representante) {
                return res.status(400).json({ mensaje: "Los datos de la empresa son obligatorios." });
            }
            nuevoClienteData = {
                ...nuevoClienteData,
                ruc: ruc || "",
                domicilio_fiscal: domicilio_fiscal || "",
                representante_legal: representante_legal || "",
                dni_representante: dni_representante || "",
            };
        } else {
            if (!dni) {
                return res.status(400).json({ mensaje: "El DNI es obligatorio para clientes Particulares." });
            }
            nuevoClienteData = { ...nuevoClienteData, dni: dni || "" };
        }

        const nuevoCliente = await db.clientes.create(nuevoClienteData);

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
        const cliente = await db.clientes.findByPk(id);

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

        const cliente = await db.clientes.findByPk(id);
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
