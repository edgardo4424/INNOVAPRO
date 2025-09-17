const path = require("path");
const logo = path.join(__dirname, "../../../../../assets/pdf/logo_innova.png");

const { pdfHeader } = require("../../components/liquidacion/pdfHeader");
const {
  pdfInfoTrabajador,
} = require("../../components/liquidacion/pdfInfoTrabajador");

const {
  pdfSeccionCtsTrunca,
} = require("../../components/liquidacion/pdfSeccionCtsTrunca");
const {
  pdfSeccionGratificacion,
} = require("../../components/liquidacion/pdfSeccionGratificacion");
const {
  pdfSeccionRemuneracion,
} = require("../../components/liquidacion/pdfRemuneracion");
const {
  pdfResumenFinal,
} = require("../../components/liquidacion/pdfResumenFinal");
const { lineaHorizontal } = require("../../styles/lineaHorizontal");

function liquidacionTemplate(data) {
  const {
    trabajador,
    contrato,
    detalle_liquidacion,
    planilla_mensual,
    cts,
    gratificacion,
  } = data;

  const total_pagar_liquidacion =
    Number(gratificacion.total_pagar) +
    Number(cts.cts_depositar) +
    Number(planilla_mensual.saldo_por_pagar);

  return {
    content: [
      pdfHeader({
        title: "LIQUIDACIÓN DE BENEFICIOS SOCIALES",
        logo: logo,
      }),
      pdfInfoTrabajador({
        trabajador,
        contrato,
        detalle_liquidacion,
        planilla_mensual,
      }),
      /* pdfPeriodoLaborado({ detalle_liquidacion, planilla_mensual }), */

      lineaHorizontal(),

      pdfSeccionCtsTrunca({ cts, planilla_mensual }),
      //pdfSeccionVacaciones(data.vacaciones),
      pdfSeccionGratificacion({ gratificacion }),
      pdfSeccionRemuneracion({ planilla_mensual }),
      //pdfDetalleOtrosDescuentos(descuentos.otros),
      pdfResumenFinal({ total: total_pagar_liquidacion }),
    ],
    styles: {
      docTypeHeaderCenter: {
        fontSize: 13,
        bold: true,
        alignment: "center",
        color: "#1b274a",
      },
      tableSectionTitle: {
        fontSize: 9,
        bold: true,
        color: "#1b274a", // Azul oscuro corporativo
        alignment: "left",
      },
      infoTable: {
        fontSize: 7,
      },
    },
    defaultStyle: {
      font: "Helvetica",
      color: "#616161",
    },
    pageMargins: [40, 30, 40, 30],
  };
}

module.exports = { liquidacionTemplate };
