const { Cliente } = require("../models/clienteModel");
const db = require("../../../../database/models"); // Llamamos los modelos sequelize de la base de datos // Llamamos los modelos sequalize de la base de datos

class SequelizeClienteRepository {
    getModel() {
        return require('../models/clienteModel').Cliente; // Retorna el modelo de cliente
    }

    async crear(clienteData) {
    const transaction = await db.sequelize.transaction();

    const nuevoCliente = await Cliente.create(clienteData, { transaction });

    console.log("NUEVO CLIENTE", nuevoCliente);
    // Relacionar contactos si existen
    if (clienteData.contactosIds && clienteData.contactosIds.length > 0) {
      const contactosRelacionados = await db.contactos.findAll({
        where: { id: clienteData.contactosIds },
        transaction,
      });

      console.log("CONTACTOS RELACIONADOS", contactosRelacionados);

      if (contactosRelacionados.length > 0) {
        const clienteContactos = contactosRelacionados.map((contacto) => ({
          contacto_id: contacto.id,
          cliente_id: nuevoCliente.id,
        }));

        console.log("clienteContactos", clienteContactos);
        await db.contacto_clientes.bulkCreate(clienteContactos, {
          transaction,
        });
      }
    }

    // Relacionar obras si existen
    if (clienteData.obrasIds && clienteData.obrasIds.length > 0) {
      const obrasRelacionadas = await db.obras.findAll({
        where: { id: clienteData.obrasIds },
        transaction,
      });

      if (obrasRelacionadas.length > 0) {
        const clienteObras = obrasRelacionadas.map((obra) => ({
          cliente_id: nuevoCliente.id,
          obra_id: obra.id,
        }));

        console.log("clienteObras", clienteObras);
        await db.cliente_obras.bulkCreate(clienteObras, { transaction });
        console.log("inserte 2");
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
                },
            ]
        }); // Llama al método del repositorio para obtener todos los clientes
    }

    async obtenerPorId(id) {
        return await Cliente.findByPk(id); // Llama al método del repositorio para obtener un cliente por ID
    }

    async actualizarCliente(id, clienteData) {
        const cliente = await Cliente.findByPk(id); // Busca el cliente por ID
        if (!cliente) { // Si no se encuentra el cliente, retorna null
          return null; 
        }
        await cliente.update(clienteData); // Actualiza el cliente con los nuevos datos
        return cliente; // Retorna el cliente actualizado
      }

    async eliminarCliente(id) {
        const cliente = await this.obtenerPorId(id); // Llama al método del repositorio para obtener el cliente por ID
        if (!cliente) return null; // Si no se encuentra el cliente, retorna null
        return await cliente.destroy(); // Elimina el cliente y retorna el resultado
    }
}

module.exports = SequelizeClienteRepository; // Exporta la clase para que pueda ser utilizada en otros módulos