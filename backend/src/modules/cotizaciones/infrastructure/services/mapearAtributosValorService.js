function mapearAtributosValor(atributosDelUso) {
  if (!Array.isArray(atributosDelUso)) return [];

  // Agrupamos por numero_formulario_uso + zona
  const agrupado = atributosDelUso.reduce((acc, item) => {
    const key = `${item.numero_formulario_uso}_${item.zona}`;

    if (!acc[key]) {
      acc[key] = {
        numero_formulario_uso: item.numero_formulario_uso,
        zona: item.zona,
        nota_zona: item.nota_zona
      };
    }

    // Obtener llave_json
    const atributoKey = item.atributo?.llave_json;

    if (atributoKey) {
      // Convertir a número si corresponde
      let valor = item.valor;
      if (!isNaN(valor) && valor !== '') {
        valor = Number(valor);
      }

      acc[key][atributoKey] = valor;
    }

    return acc;
  }, {});

  // Retornar como array
  return Object.values(agrupado);
}

module.exports = {
  mapearAtributosValor
};
