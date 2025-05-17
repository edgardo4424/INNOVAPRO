const { Uso } = require("../models/usoModel");
const db = require("../../../../models"); // Llamamos los modelos sequalize de la base de datos

class SequelizeUsoRepository {
  getModel() {
    return require("../models/usoModel").Uso; // Retorna el modelo de Uso
  }

  async obtenerUsos() {
    return await Uso.findAll();
  }

}

module.exports = SequelizeUsoRepository; // Exporta la clase para que pueda ser utilizada en otros módulos
