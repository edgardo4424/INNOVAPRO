function pdfPeriodoLaborado({ detalle_liquidacion }) {
  // Construye texto desde años, meses, días
  function construirMensajeTiempo({ anios, meses, dias }) {
    const partes = [];

    if (anios > 0) partes.push(`${anios} ${anios === 1 ? 'año' : 'años'}`);
    if (meses > 0) partes.push(`${meses} ${meses === 1 ? 'mes' : 'meses'}`);
    if (dias > 0) partes.push(`${dias} ${dias === 1 ? 'día' : 'días'}`);

    return partes.length > 0 ? partes.join(', ') : "0 días";
  }

  const mensaje_tiempo_laborado = construirMensajeTiempo(detalle_liquidacion.tiempo_laborado);
  const mensaje_tiempo_computado = construirMensajeTiempo(detalle_liquidacion.tiempo_computado);
  const faltas_injustificadas = detalle_liquidacion.faltas_injustificadas ?? 0;

  return {
    table: {
      widths: [200, "*"],
      body: [
        ["TIEMPO DE SERVICIO", mensaje_tiempo_laborado],
        ["TIEMPO COMPUTABLE", mensaje_tiempo_computado],
        ["FALTAS INJUSTIFICADAS", `${faltas_injustificadas}`],
      ],
    },
    layout: "lightHorizontalLines",
    margin: [0, 0, 0, 10],
  };
}

module.exports = { pdfPeriodoLaborado };