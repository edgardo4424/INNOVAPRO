

/* const { pdfInfoTrabajador } = require("../components/pdfInfoTrabajador");
const { pdfPeriodoLaborado } = require("../components/pdfPeriodoLaborado");
const { pdfRemuneracionComputable } = require("../components/pdfRemuneracionComputable");
const { pdfSeccionCtsTrunca } = require("../components/pdfSeccionCtsTrunca");
const { pdfSeccionVacaciones } = require("../components/pdfSeccionVacaciones");
const { pdfSeccionGratificacion } = require("../components/pdfSeccionGratificacion");
const { pdfSeccionRemuneracion } = require("../components/pdfSeccionRemuneracion");
const { pdfDetalleOtrosDescuentos } = require("../components/pdfDetalleOtrosDescuentos");
const { pdfResumenFinal } = require("../components/pdfResumenFinal"); */

const { pdfHeader } = require("../../components/liquidacion/pdfHeader");

function liquidacionTemplate(data, logo) {
  const {
    trabajador,
    contrato,
    baja,
    remuneracion,
    descuentos,
    resumen,
  } = data;

  return {
    content: [
      pdfHeader({ title: "LIQUIDACIÓN DE BENEFICIOS SOCIALES", logo }),
      /* pdfInfoTrabajador(trabajador, contrato, baja),
      pdfPeriodoLaborado(baja),
      pdfRemuneracionComputable(remuneracion),
      pdfSeccionCtsTrunca(data.cts),
      pdfSeccionVacaciones(data.vacaciones),
      pdfSeccionGratificacion(data.gratificacion),
      pdfSeccionRemuneracion(data.remuneracionUltimoMes),
      pdfDetalleOtrosDescuentos(descuentos.otros),
      pdfResumenFinal(resumen), */
    ],
    styles: {
      titulo: { fontSize: 10, bold: true },
      subtitulo: { fontSize: 9, bold: true },
      texto: { fontSize: 8 },
      tablaHeader: { fillColor: "#f0f0f0", bold: true, fontSize: 8 },
      tablaBody: { fontSize: 8 },
    },
    defaultStyle: {
      font: "Helvetica",
    },
    pageMargins: [40, 40, 40, 60],
  };
}

module.exports = { liquidacionTemplate };