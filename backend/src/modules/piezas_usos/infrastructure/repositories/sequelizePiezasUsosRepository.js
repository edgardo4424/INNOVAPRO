const { PiezasUsos } = require("../models/piezasUsosModel");
const db = require("../../../../database/models"); // Llamamos los modelos sequelize de la base de datos // Llamamos los modelos sequalize de la base de datos

class SequelizePiezasUsosRepository {
  getModel() {
    return require("../models/piezasUsosModel").PiezasUsos; // Retorna el modelo de Uso
  }

  async obtenerPiezasUsos() {
    return await PiezasUsos.findAll({
     /*  include: [
        {
          model: db.piezas,
          as: "pieza"
        }
      ] */
    });
  }

}

module.exports = SequelizePiezasUsosRepository; // Exporta la clase para que pueda ser utilizada en otros módulos
