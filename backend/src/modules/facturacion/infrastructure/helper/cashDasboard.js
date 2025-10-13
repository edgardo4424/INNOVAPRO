// Helpers de fecha (todas inclusivas)
function toDateOnly(d) {
  const iso = new Date(d);
  // Forzamos a YYYY-MM-DD (sin hora) en local
  const y = iso.getFullYear();
  const m = String(iso.getMonth() + 1).padStart(2, '0');
  const day = String(iso.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
function addDays(base, delta) {
  const d = new Date(base);
  d.setDate(d.getDate() + delta);
  return d;
}
function addMonths(base, delta) {
  const d = new Date(base);
  d.setMonth(d.getMonth() + delta);
  return d;
}

// Une resultados por (fecha, ruc)
function mergeByFechaRuc(facts, notes) {
  const key = (f, r) => `${f}__${r}`;
  const map = new Map();

  const upsert = (fecha, ruc) => {
    const k = key(fecha, ruc);
    if (!map.has(k)) {
      map.set(k, {
        fecha,
        empresa_ruc: ruc,
        factura_monto: 0,
        boleta_monto: 0,
        nota_credito_monto: 0,
        nota_debito_monto: 0,
        total_monto: 0,
      });
    }
    return map.get(k);
  };

  facts.forEach(row => {
    const fecha = row.fecha;
    const ruc = row.empresa_ruc;
    const dst = upsert(fecha, ruc);
    dst.factura_monto += Number(row.factura_monto || 0);
    dst.boleta_monto  += Number(row.boleta_monto  || 0);
  });

  notes.forEach(row => {
    const fecha = row.fecha;
    const ruc = row.empresa_ruc;
    const dst = upsert(fecha, ruc);
    dst.nota_credito_monto += Number(row.nota_credito_monto || 0);
    dst.nota_debito_monto  += Number(row.nota_debito_monto  || 0);
  });

  // total por fila
  for (const v of map.values()) {
    v.total_monto =
      v.factura_monto +
      v.boleta_monto +
      v.nota_credito_monto +
      v.nota_debito_monto;
  }

  // ordenar por fecha asc y ruc
  return Array.from(map.values())
    .sort((a, b) => a.fecha.localeCompare(b.fecha) || a.empresa_ruc.localeCompare(b.empresa_ruc));
}

// Agrega razón social desde el map
function attachRazonSocial(rows, filialMap) {
  return rows.map(r => ({
    ...r,
    razon_social: filialMap[r.empresa_ruc] || 'No registrada',
  }));
}

// Suma por filial dentro de un arreglo por-día
function totalsByFilial(rows) {
  const m = new Map();
  rows.forEach(r => {
    if (!m.has(r.empresa_ruc)) {
      m.set(r.empresa_ruc, {
        empresa_ruc: r.empresa_ruc,
        factura_monto: 0,
        boleta_monto: 0,
        nota_credito_monto: 0,
        nota_debito_monto: 0,
        total_monto: 0,
      });
    }
    const acc = m.get(r.empresa_ruc);
    acc.factura_monto       += r.factura_monto;
    acc.boleta_monto        += r.boleta_monto;
    acc.nota_credito_monto  += r.nota_credito_monto;
    acc.nota_debito_monto   += r.nota_debito_monto;
    acc.total_monto         += r.total_monto;
  });
  return Array.from(m.values()).sort((a,b)=>a.empresa_ruc.localeCompare(b.empresa_ruc));
}

module.exports = { toDateOnly, addDays, addMonths, mergeByFechaRuc,attachRazonSocial, totalsByFilial };