const { Cliente } = require("../models/clienteModel");
const db = require("../../../../database/models"); // Llamamos los modelos sequelize de la base de datos // Llamamos los modelos sequalize de la base de datos

class SequelizeClienteRepository {
    getModel() {
        return require('../models/clienteModel').Cliente; // Retorna el modelo de cliente
    }

    async crear(clienteData) {
    const transaction = await db.sequelize.transaction();

    const nuevoCliente = await Cliente.create(clienteData, { transaction });

    // Relacionar contactos si existen
    if (clienteData.contactos_asociados && clienteData.contactos_asociados.length > 0) {
      const contactosRelacionados = await db.contactos.findAll({
        where: { id: clienteData.contactos_asociados },
        transaction,
      });

      if (contactosRelacionados.length > 0) {
        const clienteContactos = contactosRelacionados.map((contacto) => ({
          contacto_id: contacto.id,
          cliente_id: nuevoCliente.id,
        }));

        await db.contacto_clientes.bulkCreate(clienteContactos, {
          transaction,
        });
      }
    }

    // Relacionar obras si existen
    if (clienteData.obras_asociadas && clienteData.obras_asociadas.length > 0) {
      const obrasRelacionadas = await db.obras.findAll({
        where: { id: clienteData.obras_asociadas },
        transaction,
      });

      if (obrasRelacionadas.length > 0) {
        const clienteObras = obrasRelacionadas.map((obra) => ({
          cliente_id: nuevoCliente.id,
          obra_id: obra.id,
        }));

        await db.cliente_obras.bulkCreate(clienteObras, { transaction });
 
      }
    }

    await transaction.commit();

    return nuevoCliente;
  }

    async obtenerClientes() {
        return await Cliente.findAll({
            attributes: [
                "id", "razon_social", "tipo", "ruc", "tipo_documento", "dni", "telefono", "email",
                "domicilio_fiscal", "representante_legal", "dni_representante", "creado_por", "fecha_creacion"
            ],
            include: [
                {
                    model: db.contactos,
                    through: { attributes: [] }, // Relación correcta con la tabla intermedia
                    as: "contactos_asociados",
                    attributes: ["id"],
                },
                {
                    model: db.obras,
                    through: { attributes: [] }, // Relación correcta con la tabla intermedia
                    as: "obras_asociadas",
                     attributes: ["id"],
                }
            ]
        }); // Llama al método del repositorio para obtener todos los clientes
    }

    async obtenerPorId(id) {
        return await Cliente.findByPk(id); // Llama al método del repositorio para obtener un cliente por ID
    }

    async actualizarCliente(id, clienteData) {
    const cliente = await Cliente.findByPk(id); // Busca el cliente por ID
    if (!cliente) {
      // Si no se encuentra el cliente, retorna null
      return null;
    }
    await cliente.update(clienteData); // Actualiza el cliente con los nuevos datos

    // Actualiza relaciones
    if (Array.isArray(clienteData.contactos_asociados)) {
      await cliente.setContactos_asociados(clienteData.contactos_asociados);
    }

    if (Array.isArray(clienteData.obras_asociadas)) {
      await cliente.setObras_asociadas(clienteData.obras_asociadas);
    }

    return cliente; // Retorna el cliente actualizado
  }

    async eliminarCliente(id) {
        const cliente = await this.obtenerPorId(id); // Llama al método del repositorio para obtener el cliente por ID
        if (!cliente) return null; // Si no se encuentra el cliente, retorna null
        return await cliente.destroy(); // Elimina el cliente y retorna el resultado
    }
}

module.exports = SequelizeClienteRepository; // Exporta la clase para que pueda ser utilizada en otros módulos