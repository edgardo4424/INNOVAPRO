const { Atributo } = require("../models/atributoModel");
const db = require("../../../../models");

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
      include: [
        {
          model: db.atributos_valor,
          as: "valores",
          attributes: ["valor"],
        },
      ],
    });

    // Transformamos para devolver el array de opciones directamente
    const atributosTransformados = atributos.map((atrib) => {
      const json = atrib.toJSON();
      return {
        ...json,
        opciones: json.valores.map((v) => v.valor),
      };
    });

    return atributosTransformados;
  }

}

module.exports = SequelizeAtributoRepository; // Exporta la clase para que pueda ser utilizada en otros módulos
