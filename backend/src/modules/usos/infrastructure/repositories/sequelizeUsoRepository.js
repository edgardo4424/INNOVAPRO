const { Uso } = require("../models/usoModel");
const db = require("../../../../database/models"); // Llamamos los modelos sequelize de la base de datos // Llamamos los modelos sequalize de la base de datos

class SequelizeUsoRepository {
  getModel() {
    return require("../models/usoModel").Uso; // Retorna el modelo de Uso
  }

  async obtenerUsos() {
  return await Uso.findAll({
    order: [['descripcion', 'ASC']]
  });
}

}

module.exports = SequelizeUsoRepository; // Exporta la clase para que pueda ser utilizada en otros módulos
