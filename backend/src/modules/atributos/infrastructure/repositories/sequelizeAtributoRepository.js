const { Atributo } = require("../models/atributoModel");
const db = require("../../../../database/models"); // Llamamos los modelos sequelize de la base de datos

class SequelizeAtributoRepository {
  
  getModel() {
    return require("../models/piezaModel").Atributo; // Retorna el modelo de cliente
  }

  async obtenerAtributos() {
    return await Atributo.findAll();
  }

  async obtenerAtributosPorUsoId(uso_id) {
    const atributos = await Atributo.findAll({
      where: { uso_id },
      order: [["orden", "ASC"]],
      attributes: [
        "id",
        "llave_json",
        "nombre",
        "tipo_dato",
        "unidad_medida",
        "orden",
        "uso_id",
        "valores_por_defecto", // ✅ IMPORTANTE
      ],
      exclude: ["createdAt", "updatedAt"], // opcional
    });
  
    return atributos;
  }  

}

module.exports = SequelizeAtributoRepository; // Exporta la clase para que pueda ser utilizada en otros módulos
