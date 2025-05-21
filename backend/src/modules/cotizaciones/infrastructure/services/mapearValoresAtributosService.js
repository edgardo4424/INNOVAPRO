const db = require("../../../../models");

async function mapearValoresAtributos(
 { uso_id,
  despiece_id,
  atributos_formulario}
) {
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
          numero_formulario_uso: index+1
        });
      }
    }
  });

  return valoresDeAtributosMapeados
}

module.exports = {
  mapearValoresAtributos, // Exporta la función para que pueda ser utilizada en otros módulos
};
