const { Pieza } = require("../models/piezaModel");
const db = require("../../../../database/models"); // Llamamos los modelos sequelize de la base de datos // Llamamos los modelos sequalize de la base de datos

class SequelizePiezaRepository {
  getModel() {
    return require("../models/piezaModel").Pieza; // Retorna el modelo de cliente
  }

  async crear(piezaData) {
    return await Pieza.create(piezaData);
  }

  async obtenerPiezas() {
    return await Pieza.findAll({
      include: [
        {
          model: db.familias_piezas,
          as: "familia",
          attributes: ["id", "descripcion"],
        },
      ],
    });
  }

  async obtenerPorId(id) {
    return await Pieza.findByPk(id); // Llama al método del repositorio para obtener un cliente por ID
  }

  async actualizarPieza(id, piezaData) {
    const pieza = await Pieza.findByPk(id); // Busca el pieza por ID
    if (!pieza) {
      // Si no se encuentra la pieza, retorna null
      console.log("❌ Pieza no encontrado");
      return null;
    }
    await pieza.update(piezaData); // Actualiza el pieza con los nuevos datos
    return pieza; // Retorna el pieza actualizado
  }

  async eliminarPieza(id) {
    const pieza = await this.obtenerPorId(id); // Llama al método del repositorio para obtener el pieza por ID
    if (!pieza) return null; // Si no se encuentra el pieza, retorna null
    return await pieza.destroy(); // Elimina el pieza y retorna el resultado
  }

  async obtenerPiezaPorItem(item,transaction=null){
    return await Pieza.findOne({ where: { item },transaction });
}
}

module.exports = SequelizePiezaRepository; // Exporta la clase para que pueda ser utilizada en otros módulos
