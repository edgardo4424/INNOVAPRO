const db = require("../models");
const Cliente = db.clientes;
const Obra = db.obras; 
const Contacto = db.contactos;

// 🔹 Obtener todos los contactos
exports.obtenerContactos = async (req, res) => {
    try {
        const contactos = await Contacto.findAll({
             
            include: [
                {
                    model: Cliente,
                    through: { attributes: [] }, 
                    as: "clientes_asociados",
                },
                {
                    model: Obra,
                    through: { attributes: [] }, 
                    as: "obras_asociadas",
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
        console.log(" Datos recibidos en req.body:", req.body);

        const { nombre, email, telefono, cargo, clientes: clientesIds, obras: obrasIds } = req.body;

        if (!nombre || !email) {
            return res.status(400).json({ mensaje: "Nombre y email son obligatorios" });
        }

        console.log("🔹 Clientes IDs:", clientesIds);
        console.log("🔹 Obras IDs:", obrasIds);

        const transaction = await Contacto.sequelize.transaction();

        try {
            const nuevoContacto = await Contacto.create({ nombre, email, telefono, cargo }, { transaction });

            if (clientesIds && clientesIds.length > 0) {
                const clientesRelacionados = await Cliente.findAll({ where: { id: clientesIds }, transaction });

                if (clientesRelacionados.length > 0) {
                    const clienteContactos = clientesRelacionados.map(cliente => ({
                        contacto_id: nuevoContacto.id,
                        cliente_id: cliente.id
                    }));
                    await db.contacto_clientes.bulkCreate(clienteContactos, { transaction });
                }
            }

            if (obrasIds && obrasIds.length > 0) {
                const obrasRelacionadas = await Obra.findAll({ where: { id: obrasIds }, transaction });

                if (obrasRelacionadas.length > 0) {
                    const contactoObras = obrasRelacionadas.map(obra => ({
                        contacto_id: nuevoContacto.id,
                        obra_id: obra.id
                    }));
                    await db.contacto_obras.bulkCreate(contactoObras, { transaction });
                }
            }

            await transaction.commit();

            res.status(201).json({ mensaje: "✅ Contacto creado con éxito", contacto: nuevoContacto });

        } catch (error) {
            await transaction.rollback();
            throw error;
        }

    } catch (error) {
        console.error("❌ Error al crear contacto:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

// 🔹 Actualizar un contacto
exports.actualizarContacto = async (req, res) => {
    const { id } = req.params;
    const { nombre, email, telefono, cargo, clientes: clientesIds, obras: obrasIds } = req.body;

    try {
        const contacto = await Contacto.findByPk(id);
        if (!contacto) {
            return res.status(404).json({ mensaje: "Contacto no encontrado" });
        }

        // Actualizar datos básicos del contacto
        await contacto.update({ nombre, email, telefono, cargo });

        // Actualizar relación con clientes
        if (Array.isArray(clientesIds)) {
            await contacto.setClientes_asociados(clientesIds);
        }

        // Actualizar relación con obras
        if (Array.isArray(obrasIds)) {
            await contacto.setObras_asociadas(obrasIds);
        }

        res.json({ mensaje: "✅ Contacto actualizado correctamente", contacto });
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