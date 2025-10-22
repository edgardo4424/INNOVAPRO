function formatearFechaIsoADMY(fechaIso) {
  console.log("Fecha ISO recibida:", fechaIso);
  const fecha = new Date(fechaIso);
  const dia = String(fecha.getUTCDate()).padStart(2, '0');
  const mes = String(fecha.getUTCMonth() + 1).padStart(2, '0');
  const anio = fecha.getUTCFullYear();
  return `${dia}/${mes}/${anio}`;
}

module.exports = {
    formatearFechaIsoADMY
}