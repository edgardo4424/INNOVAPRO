const { ContriSUNAT } = require('../models/contrisunat');
const { Ubigeo } = require('../models/ubigeos');

class SequelizeSunatRepository {
  constructor() {
    this.modelo = ContriSUNAT;
  }

  getModel() {
    return this.modelo;
  }

  async obtenerPorRUC(ruc) {
    return await this.modelo.findOne({
      where: { ruc },
      include: [
        {
          model: Ubigeo,
          as: "ubigeo_info",
          required: false,
          attributes: ["codigo", "distrito", "provincia", "departamento"]
        }
      ]
    })
  }

  async isertarMasivamente(datos = []) {
    if (!Array.isArray(datos) || datos.length === 0) return;

    await this.modelo.bulkCreate(datos, {
      updateOnDuplicate: [
        "nombre_razon_social",
        "estado_contribuyente",
        "condicion_domicilio",
        "ubigeo",
        "tipo_via",
        "nombre_via",
        "codigo_zona",
        "tipo_zona",
        "numero",
        "interior",
        "lote",
        "departamento",
        "manzana",
        "kilometro"
      ]
    })
  }
}

module.exports = SequelizeSunatRepository;