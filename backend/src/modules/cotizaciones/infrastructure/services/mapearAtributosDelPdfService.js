function mapearPorAtributos(data, atributosMap) {
  const agrupado = {};

  for (const item of data) {
    const key = `${item.numero_formulario_uso}|${item.zona}`;

    if (!agrupado[key]) {
      agrupado[key] = {
        numero_formulario_uso: item.numero_formulario_uso,
        zona: item.zona,
        nota_zona: item.nota_zona
      };
    }

    const campo = atributosMap[item.atributo_id];
    if (campo) {
      agrupado[key][campo] = isNaN(item.valor) ? item.valor : Number(item.valor);
    }
  }

  return Object.values(agrupado);
}

function agruparPorZonaYAtributos(data) {
  const resultado = [];

  function claveSinFormulario(obj) {
    const { numero_formulario_uso, ...resto } = obj;
    const ordenado = Object.keys(resto)
      .sort()
      .reduce((acc, key) => {
        acc[key] = resto[key];
        return acc;
      }, {});
    return JSON.stringify(ordenado);
  }

  const zonasMap = new Map();

  for (const item of data) {
    const { zona } = item;
    if (!zonasMap.has(zona)) {
      zonasMap.set(zona, new Map());
    }

    const zonaMap = zonasMap.get(zona);
    const clave = claveSinFormulario(item);

    if (zonaMap.has(clave)) {
      const existente = zonaMap.get(clave);
      existente.cantidad_uso += 1;
    } else {
      const nuevo = { ...item, cantidad_uso: 1 };
      zonaMap.set(clave, nuevo);
    }
  }

  for (const [zona, atributosMap] of zonasMap.entries()) {

    resultado.push({
      zona,
      atributos: Array.from(atributosMap.values())
    });
  }

  return resultado;
}

function agruparPorZona(data) {
  const resultado = [];

  const zonasMap = new Map();

  for (const item of data) {
    const { zona } = item;
    if (!zonasMap.has(zona)) {
      zonasMap.set(zona, []);
    }

    // Añadir el item tal cual está, sin agrupar
    zonasMap.get(zona).push(item);
  }

  // Convertir el map a array
  for (const [zona, atributos] of zonasMap.entries()) {
    resultado.push({
      zona,
      atributos
    });
  }

  return resultado;
}

function agruparPuntalesPorZonaYAtributos(data) {
  const resultado = [];

  const zonasMap = new Map();

  for (const item of data) {
    const { zona, tipoPuntal, tripode, cantidad, nota_zona } = item;
    if (!zonasMap.has(zona)) {
      zonasMap.set(zona, {
        nota_zona,
        atributosMap: new Map(),
      });
    }

    const zonaObj = zonasMap.get(zona);
    const clave = `${tipoPuntal}|${tripode}`;

    if (zonaObj.atributosMap.has(clave)) {
      zonaObj.atributosMap.get(clave).cantidad += cantidad;
    } else {
      zonaObj.atributosMap.set(clave, {
        tipoPuntal,
        tripode,
        cantidad,
      });
    }
  }

  for (const [zona, { nota_zona, atributosMap }] of zonasMap.entries()) {
    resultado.push({
      zona,
      nota_zona,
      atributos: Array.from(atributosMap.values()),
    });
  }

  return resultado;
}

function agruparPuntalesPorZonaYTipo(data) {
  const resultado = [];

  const zonasMap = new Map();

  for (const item of data) {
    const { zona, tipoPuntal, cantidad, nota_zona } = item;

    if (!zonasMap.has(zona)) {
      zonasMap.set(zona, {
        nota_zona,
        tipoMap: new Map(),
      });
    }

    const zonaObj = zonasMap.get(zona);
    const clave = tipoPuntal;

    if (zonaObj.tipoMap.has(clave)) {
      zonaObj.tipoMap.get(clave).cantidad += cantidad;
    } else {
      zonaObj.tipoMap.set(clave, {
        tipoPuntal,
        cantidad,
      });
    }
  }

  for (const [zona, { nota_zona, tipoMap }] of zonasMap.entries()) {
    resultado.push({
      zona,
      nota_zona,
      atributos: Array.from(tipoMap.values()),
    });
  }

  return resultado;
}



module.exports = { mapearPorAtributos, agruparPorZonaYAtributos, agruparPorZona, agruparPuntalesPorZonaYAtributos, agruparPuntalesPorZonaYTipo };