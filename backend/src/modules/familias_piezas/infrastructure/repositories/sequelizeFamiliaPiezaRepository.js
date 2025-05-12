const { FamiliaPieza } = require("../models/familiaPiezaModel");

class SequelizePiezaRepository {
  getModel() {
    return require("../models/familiaPiezaModel").FamiliaPieza; // Retorna el modelo de cliente
  }

  async obtenerFamiliasPiezas() {
    return await FamiliaPieza.findAll();
  }
}

module.exports = SequelizePiezaRepository; // Exporta la clase para que pueda ser utilizada en otros módulos
