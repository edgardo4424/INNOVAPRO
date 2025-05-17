// helpers/despieceUtils.js

function agruparPorPieza(todosDespieces, cantidadAndamios) {
    const mapaPiezas = new Map();
  
    todosDespieces.forEach((despiece, i) => {
      despiece.forEach(({ pieza, cantidad }) => {
        if (!mapaPiezas.has(pieza)) {
          mapaPiezas.set(pieza, { pieza, cantidades: Array(cantidadAndamios).fill(0) });
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

  module.exports = { 
    agruparPorPieza,
    calcularSubtotales,
    mapearPiezasConDatos,
    combinarResultados,
    calcularTotalesGenerales,
   };