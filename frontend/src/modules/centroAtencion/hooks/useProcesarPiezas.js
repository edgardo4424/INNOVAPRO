// src/modules/.../hooks/useProcesarPiezas.js
const toNumber = (v) => {
  const n = parseFloat(String(v ?? 0).toString().replace(",", "."));
  return Number.isFinite(n) ? n : 0;
};

const norm = (s) => String(s ?? "").trim().toUpperCase();

/**
 * @param {Array<{cod_Producto:string, descripcion:string, cantidad:number, unidad?:string}>} excelPiezas
 * @param {Array<{id:number,item:string,descripcion:string,peso_kg:string,precio_venta_soles:string,precio_alquiler_soles:string,familia_id?:number}>} piezasObtenidas
 * @returns {{ despiece: Array, resumen: Object, noEncontradas: Array }}
 */
const procesarPiezas = (excelPiezas = [], piezasObtenidas = []) => {
  // 1) Normalizar/agrupado por código y sumar cantidades
  const agrupadas = new Map(); // code => { cod_Producto, descripcion, cantidad, unidad }
  for (const row of excelPiezas || []) {
    const code = norm(row.cod_Producto);
    if (!code) continue;
    const qty = toNumber(row.cantidad);
    if (qty <= 0) continue; // ignora filas vacías o no válidas

    if (!agrupadas.has(code)) {
      agrupadas.set(code, {
        cod_Producto: code,
        descripcion: row.descripcion ?? "",
        cantidad: qty,
        unidad: row.unidad || "NIU",
      });
    } else {
      agrupadas.get(code).cantidad += qty;
    }
  }

  // 2) Index de piezas disponibles por item
  const indexPiezas = new Map(); // ITEM => pieza
  for (const p of piezasObtenidas || []) {
    indexPiezas.set(norm(p.item), p);
  }

  // 3) Construir despiece y recolectar no encontradas
  const despiece = [];
  const noEncontradas = [];

  for (const item of agrupadas.values()) {
    const pieza = indexPiezas.get(item.cod_Producto);
    if (!pieza) {
      noEncontradas.push({
        cod_Producto: item.cod_Producto,
        descripcion: item.descripcion,
        cantidad: item.cantidad,
        unidad: item.unidad,
      });
      continue;
    }

    const qty = toNumber(item.cantidad);
    const pesoUnit = toNumber(pieza.peso_kg);
    const pvSolesUnit = toNumber(pieza.precio_venta_soles);
    const paSolesUnit = toNumber(pieza.precio_alquiler_soles);

    // Línea de despiece con totales por línea (para que tu resumen actual funcione)
    despiece.push({
      pieza_id: pieza.id,
      item: pieza.item,
      descripcion: pieza.descripcion,
      familia_id: pieza.familia_id,
      unidad: item.unidad || "NIU",

      cantidad: qty,
      total: qty, // tu resumen usa p.total como contador de piezas

      // Totales por línea
      peso_kg: (qty * pesoUnit).toFixed(2),
      precio_venta_soles: (qty * pvSolesUnit).toFixed(2),
      precio_alquiler_soles: (qty * paSolesUnit).toFixed(2),

      // Marca para integrarlo como adicional en tu lógica existente
      esAdicional: true,
    });
  }

  // 4) Resumen (basado en los mismos campos que ya estás usando en tu componente)
  const sum = (arr, get) =>
    arr.reduce((acc, it) => acc + toNumber(get(it)), 0);

  const total_piezas = sum(despiece, (p) => p.total);
  const peso_total_kg_num = sum(despiece, (p) => p.peso_kg);
  const precio_subtotal_venta_soles_num = sum(despiece, (p) => p.precio_venta_soles);
  const precio_subtotal_alquiler_soles_num = sum(despiece, (p) => p.precio_alquiler_soles);

  const resumen = {
    total_piezas,
    peso_total_kg: peso_total_kg_num.toFixed(2),
    peso_total_ton: (peso_total_kg_num / 1000).toFixed(2),
    precio_subtotal_venta_soles: precio_subtotal_venta_soles_num.toFixed(2),
    precio_subtotal_alquiler_soles: precio_subtotal_alquiler_soles_num.toFixed(2),
    precio_subtotal_venta_dolares: 0,
  };

  return { despiece, resumen, noEncontradas };
};

export default procesarPiezas;
