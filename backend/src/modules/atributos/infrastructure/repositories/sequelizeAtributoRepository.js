const { Atributo } = require("../models/atributoModel");

class SequelizeAtributoRepository {
  
  getModel() {
    return require("../models/piezaModel").Atributo; // Retorna el modelo de cliente
  }

  async obtenerAtributos() {
    return await Atributo.findAll();
  }

  async obtenerAtributosPorUsoId(uso_id) {
    return await Atributo.findAll({
      where: {
        uso_id
      },
      order: [['orden', 'ASC']] // Puedes usar 'DESC' si quieres descendente
    });
  }

}

module.exports = SequelizeAtributoRepository; // Exporta la clase para que pueda ser utilizada en otros módulos
