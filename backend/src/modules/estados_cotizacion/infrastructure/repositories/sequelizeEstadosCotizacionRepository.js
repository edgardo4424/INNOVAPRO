const { EstadosCotizacion } = require("../models/estadosCotizacionModel");
const db = require("../../../../models"); // Llamamos los modelos sequalize de la base de datos

class SequelizeEstadosCotizacionRepository {
  getModel() {
    return require("../models/estadosCotizacionModel").EstadosCotizacion; // Retorna el modelo de Estados Cotizacion
  }
  async obtenerEstadosCotizacion() {
    return await EstadosCotizacion.findAll();
  }
}

module.exports = SequelizeEstadosCotizacionRepository; // Exporta la clase para que pueda ser utilizada en otros módulos
