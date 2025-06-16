const db = require("../../../../models")

async function mapearValoresAtributos({ uso_id, despiece_id, zonas }) {
  console.log("zonas:",zonas)
  const atributos_formulario = zonas.flatMap((zona) => {
    const numero_zona = zona.zona;

    return zona.atributos_formulario.map((atributo, index) => ({
      ...atributo,
      zona: numero_zona,
      numero_formulario_uso: index + 1
    }));
  });

  // 1. Traer los atributos relacionados al uso
  const atributos = await db.atributos.findAll({
    where: { uso_id: uso_id },
    raw: true,
  });

  // 2. Crear un mapa de llave_json → atributo_id
  const mapaAtributos = new Map();
  atributos.forEach((attr) => {
    mapaAtributos.set(attr.llave_json, attr.id);
  });

  // 3. Generar los registros a insertar
  let valoresDeAtributosMapeados = [];

  atributos_formulario.forEach((obj, index) => {
   
    for (const [llave, valor] of Object.entries(obj)) {
      if (mapaAtributos.has(llave)) {
        valoresDeAtributosMapeados.push({
          despiece_id,
          atributo_id: mapaAtributos.get(llave),
          valor: valor != null ? valor.toString() : null,
          numero_formulario_uso: obj.numero_formulario_uso,
          zona: obj.zona,
          nota_zona: obj.nota_zona
        });
      }
    }
  });

  return valoresDeAtributosMapeados;
}

module.exports = {
  mapearValoresAtributos, // Exporta la función para que pueda ser utilizada en otros módulos
};
