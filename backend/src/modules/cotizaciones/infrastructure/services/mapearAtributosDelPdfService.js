function mapearPorAtributos(data, atributosMap) {
  const agrupado = {};

  for (const item of data) {
    const key = `${item.numero_formulario_uso}|${item.zona}`;

    if (!agrupado[key]) {
      agrupado[key] = {
        numero_formulario_uso: item.numero_formulario_uso,
        zona: item.zona
      };
    }

    const campo = atributosMap[item.atributo_id];
    if (campo) {
      agrupado[key][campo] = isNaN(item.valor) ? item.valor : Number(item.valor);
    }
  }

  return Object.values(agrupado);
}

module.exports = { mapearPorAtributos };