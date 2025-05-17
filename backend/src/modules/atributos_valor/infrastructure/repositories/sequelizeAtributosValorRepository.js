const { AtributosValor } = require("../models/atributosValorModel");

class SequelizeAtributosValorRepository {
  getModel() {
    return require("../models/atributosValorModel").AtributosValor; // Retorna el modelo de Atributos Valor
  }

  async crear(atributosValorData) {
    return await AtributosValor.create(atributosValorData);
  }

  async obtenerAtributosValor() {
    return await AtributosValor.findAll();
  }
  
}

module.exports = SequelizeAtributosValorRepository; // Exporta la clase para que pueda ser utilizada en otros módulos
