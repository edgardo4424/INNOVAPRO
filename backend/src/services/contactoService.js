const db = require("../models");
const Cliente = db.clientes;
const Obra = db.obras;
const Contacto = db.contactos;

/**
 * Crea un nuevo contacto con relaciones a clientes y obras, dentro de una transacción.
 */
async function crearContactoConRelaciones(datos) {
    const { nombre, email, telefono, cargo, clientes: clientesIds, obras: obrasIds } = datos;

    // Validación básica
    if (!nombre || !email) {
        throw { status: 400, mensaje: "Nombre y email son obligatorios" };
    }

    const transaction = await db.sequelize.transaction();

    try {
        // Crear el contacto base
        const nuevoContacto = await Contacto.create({ nombre, email, telefono, cargo }, { transaction });

        // Relacionar clientes si existen
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

        // Relacionar obras si existen
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

        return nuevoContacto;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

/**
 * Actualiza un contacto y sus relaciones con clientes y obras.
 */
async function actualizarContactoConRelaciones(contactoId, datos) {
    const { nombre, email, telefono, cargo, clientes: clientesIds, obras: obrasIds } = datos;

    const contacto = await Contacto.findByPk(contactoId);
    if (!contacto) {
        throw { status: 404, mensaje: "Contacto no encontrado" };
    }

    // Actualiza datos base
    await contacto.update({ nombre, email, telefono, cargo });

    // Actualiza relaciones
    if (Array.isArray(clientesIds)) {
        await contacto.setClientes_asociados(clientesIds);
    }

    if (Array.isArray(obrasIds)) {
        await contacto.setObras_asociadas(obrasIds);
    }

    return contacto;
}

module.exports = {
    crearContactoConRelaciones,
    actualizarContactoConRelaciones,
};