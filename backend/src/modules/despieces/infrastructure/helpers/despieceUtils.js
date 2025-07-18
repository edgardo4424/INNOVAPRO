// helpers/despieceUtils.js

function agruparPorPieza(todosDespieces, cantidadUso) {
    const mapaPiezas = new Map();
  
    todosDespieces.forEach((despiece, i) => {
      despiece.forEach(({ pieza, cantidad }) => {
        if (!mapaPiezas.has(pieza)) {
          mapaPiezas.set(pieza, { pieza, cantidades: Array(cantidadUso).fill(0) });
        }
        mapaPiezas.get(pieza).cantidades[i] = cantidad;
      });
    });
  
    return Array.from(mapaPiezas.values()).map(item => {
      const total = item.cantidades.reduce((a, b) => a + b, 0);
      return {
        item: item.pieza,
        ...Object.fromEntries(item.cantidades.map((c, i) => [`cant${i + 1}`, c])),
        total
      };
    });
  }
  
function calcularSubtotales(filas) {
    const columnas = Object.keys(filas[0]).filter(k => k.startsWith("cant") || k === "total");
    const subtotales = {};
    columnas.forEach(col => {
      subtotales[col] = filas.reduce((sum, row) => sum + row[col], 0);
    });
    return subtotales;
  }
  
function mapearPiezasConDatos(piezasBD) {
    const piezaInfoMap = new Map();
    piezasBD.forEach(p => piezaInfoMap.set(p["pieza.item"], p));
    return piezaInfoMap;
  }
  
function combinarResultados(resultadoFinal, piezaInfoMap) {
    return resultadoFinal
      .map(r => {
        const info = piezaInfoMap.get(r.item);
        if (!info) return null;

        const peso = parseFloat(info["pieza.peso_kg"]) || 0;
        const ventaSoles = parseFloat(info["pieza.precio_venta_soles"]) || 0;
        const ventaDolares = parseFloat(info["pieza.precio_venta_dolares"]) || 0;
        const alquiler = parseFloat(info["pieza.precio_alquiler_soles"]) || 0;
  
        return {
          pieza_id: info["pieza.id"],
          item: r.item,
          descripcion: info["pieza.descripcion"],
          total: r.total,
          peso_u_kg: peso,
          peso_kg: parseFloat((peso * r.total).toFixed(2)),
          precio_u_venta_dolares: ventaDolares,
          precio_venta_dolares: parseFloat((ventaDolares * r.total).toFixed(2)),
          precio_u_venta_soles: ventaSoles,
          precio_venta_soles: parseFloat((ventaSoles * r.total).toFixed(2)),
          precio_u_alquiler_soles: alquiler,
          precio_alquiler_soles: parseFloat((alquiler * r.total).toFixed(2)),
          stock_actual: info["pieza.stock_actual"]
        };
      })
      .filter(Boolean);
  }
  
function calcularTotalesGenerales(filas) {
    return filas.reduce((acc, item) => {
      acc.peso_kg += item.peso_kg;
      acc.precio_venta_dolares += item.precio_venta_dolares;
      acc.precio_venta_soles += item.precio_venta_soles;
      acc.precio_alquiler_soles += item.precio_alquiler_soles;
      return acc;
    }, {
      peso_kg: 0,
      precio_venta_dolares: 0,
      precio_venta_soles: 0,
      precio_alquiler_soles: 0
    });
  }

function unificarDespiecesConTotales(resultadosPorZona) {
  const mapaUnificado = {};
  const totalesGenerales = {
    total_piezas: 0,
    peso_total_kg: 0,
    peso_total_ton: 0,
    precio_subtotal_venta_dolares: 0,
    precio_subtotal_venta_soles: 0,
    precio_subtotal_alquiler_soles: 0,
  };

  for (const zona of resultadosPorZona) {
    for (const pieza of zona.despiece) {
      const id = pieza.pieza_id;

      if (!mapaUnificado[id]) {
        mapaUnificado[id] = { ...pieza };
      } else {
        mapaUnificado[id].total += pieza.total;
        mapaUnificado[id].peso_kg += pieza.peso_kg;
        mapaUnificado[id].precio_venta_dolares += pieza.precio_venta_dolares;
        mapaUnificado[id].precio_venta_soles += pieza.precio_venta_soles;
        mapaUnificado[id].precio_alquiler_soles += pieza.precio_alquiler_soles;
      }
    }

    totalesGenerales.total_piezas += Number(zona.total_piezas);
    totalesGenerales.peso_total_kg += parseFloat(zona.peso_total_kg);
    totalesGenerales.precio_subtotal_venta_dolares += parseFloat(zona.precio_subtotal_venta_dolares);
    totalesGenerales.precio_subtotal_venta_soles += parseFloat(zona.precio_subtotal_venta_soles);
    totalesGenerales.precio_subtotal_alquiler_soles += parseFloat(zona.precio_subtotal_alquiler_soles);
  }

  // 🔧 Redondear todos los valores acumulados a 2 decimales
  Object.values(mapaUnificado).forEach(p => {
    p.peso_kg = parseFloat(p.peso_kg.toFixed(2));
    p.precio_venta_dolares = parseFloat(p.precio_venta_dolares.toFixed(2));
    p.precio_venta_soles = parseFloat(p.precio_venta_soles.toFixed(2));
    p.precio_alquiler_soles = parseFloat(p.precio_alquiler_soles.toFixed(2));
  });

  totalesGenerales.peso_total_kg = parseFloat(totalesGenerales.peso_total_kg.toFixed(2));
  totalesGenerales.peso_total_ton = parseFloat((totalesGenerales.peso_total_kg / 1000).toFixed(2));
  totalesGenerales.precio_subtotal_venta_dolares = parseFloat(totalesGenerales.precio_subtotal_venta_dolares.toFixed(2));
  totalesGenerales.precio_subtotal_venta_soles = parseFloat(totalesGenerales.precio_subtotal_venta_soles.toFixed(2));
  totalesGenerales.precio_subtotal_alquiler_soles = parseFloat(totalesGenerales.precio_subtotal_alquiler_soles.toFixed(2));

  return {
    despiece: Object.values(mapaUnificado),
    totales: totalesGenerales,
  };
}


  module.exports = { 
    agruparPorPieza,
    calcularSubtotales,
    mapearPiezasConDatos,
    combinarResultados,
    calcularTotalesGenerales,
    unificarDespiecesConTotales
   };