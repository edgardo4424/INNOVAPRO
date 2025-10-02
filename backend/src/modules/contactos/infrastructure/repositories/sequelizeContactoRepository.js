const { Contacto } = require("../models/contactoModel");
const db = require("../../../../database/models"); // Llamamos los modelos sequelize de la base de datos // Llamamos los modelos sequalize de la base de datos

class SequelizeContactoRepository {
  getModel() {
    return require("../models/contactoModel").Contacto; // Retorna el modelo de contacto
  }

  async crear(contactoData) {

    const transaction = await db.sequelize.transaction();

    const nuevoContacto = await Contacto.create(contactoData, { transaction });

    /* // Relacionar clientes si existen
    if (contactoData.clientesIds && contactoData.clientesIds.length > 0) {
      const clientesRelacionados = await db.clientes.findAll({
        where: { id: contactoData.clientesIds },
        transaction
      });

      if (clientesRelacionados.length > 0) {
        const clienteContactos = clientesRelacionados.map((cliente) => ({
          contacto_id: nuevoContacto.id,
          cliente_id: cliente.id,
        }));
        await db.contacto_clientes.bulkCreate(clienteContactos, {transaction});
      }
    }

    // Relacionar obras si existen
    if (contactoData.obrasIds && contactoData.obrasIds.length > 0) {
      const obrasRelacionadas = await db.obras.findAll({
        where: { id: contactoData.obrasIds },
        transaction
      });

      if (obrasRelacionadas.length > 0) {
        const contactoObras = obrasRelacionadas.map((obra) => ({
          contacto_id: nuevoContacto.id,
          obra_id: obra.id,
        }));
        await db.contacto_obras.bulkCreate(contactoObras, { transaction });
      }
    } */

    await transaction.commit();

    return nuevoContacto;
  }

  async obtenerContactos() {
    return await Contacto.findAll();
  }

  async obtenerPorId(id) {
   
    return await Contacto.findByPk(id, {
      include: [
        { model: db.clientes, as: "clientes_asociados" },
        { model: db.obras, as: "obras_asociadas" },
      ],
    });
  }

  async actualizarContacto(id, contactoData) {
    const contacto = await Contacto.findByPk(id); // Busca el contacto por ID
    if (!contacto) {
      // Si no se encuentra el contacto, retorna null
      return null;
    }
    await contacto.update(contactoData); // Actualiza el contacto con los nuevos datos
    
    // Actualiza relaciones
    if (Array.isArray(contactoData.clientesIds)) {
        await contacto.setClientes_asociados(contactoData.clientesIds);
    }

    if (Array.isArray(contactoData.obrasIds)) {
        await contacto.setObras_asociadas(contactoData.obrasIds);
    }

    return contacto; // Retorna el contacto actualizado
  }

  async eliminarContacto(id) {
    const contacto = await this.obtenerPorId(id); // Llama al método del repositorio para obtener el contacto por ID
    if (!contacto) return null; // Si no se encuentra el contacto, retorna null
    return await contacto.destroy(); // Elimina el contacto y retorna el resultado
  }

}

module.exports = SequelizeContactoRepository; // Exporta la clase para que pueda ser utilizada en otros módulos
