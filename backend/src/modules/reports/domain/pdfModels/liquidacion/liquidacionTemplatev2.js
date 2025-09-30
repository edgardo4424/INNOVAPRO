const path = require("path");
const logo = path.join(__dirname, "../../../../../assets/pdf/logo_innova.png");

const { pdfHeader } = require("../../components/liquidacionv2/pdfHeader");
const {
  pdfInfoTrabajador,
} = require("../../components/liquidacionv2/pdfInfoTrabajador");

const {
  pdfSeccionCtsTrunca,
} = require("../../components/liquidacionv2/pdfSeccionCtsTrunca");
const {
  pdfSeccionGratificacionTrunca,
} = require("../../components/liquidacionv2/pdfSeccionGratificacionTrunca");
const {
  pdfRemuneracionTrunca,
} = require("../../components/liquidacionv2/pdfRemuneracionTrunca");

const { lineaHorizontal } = require("../../styles/lineaHorizontal");
const { pdfSeccionVacaciones } = require("../../components/liquidacionv2/pdfSeccionVacaciones");
const { pdfTotalAPagar } = require("../../components/liquidacionv2/pdfTotalAPagar");
const { pdfFooter } = require("../../components/liquidacionv2/pdfFooter");

async function liquidacionTemplatev2(data) {

  const {
    trabajador,
    contrato,
    detalles_liquidacion,
    fecha_ingreso,
    fecha_baja,
    motivo,
    filial_id
  } = data;

  return {
    content: [
      pdfHeader({
        title: "LIQUIDACIÓN DE BENEFICIOS SOCIALES",
        logo: logo,
      }),
     await pdfInfoTrabajador({
        trabajador,
        contrato,
        detalles_liquidacion,
        fecha_ingreso,
        fecha_baja,
        motivo
      }),

      lineaHorizontal(),

      pdfSeccionCtsTrunca({ contrato, detalles_liquidacion }),
      pdfSeccionVacaciones({contrato, detalles_liquidacion, trabajador}),
      pdfSeccionGratificacionTrunca({ contrato, detalles_liquidacion }),
      pdfRemuneracionTrunca({ detalles_liquidacion, trabajador, contrato }),
      pdfTotalAPagar({ detalles_liquidacion }), 
      await pdfFooter({ filial_id, trabajador, detalles_liquidacion }),
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
       parrafo: {
      margin: [0, 10, 0, 10], // margen superior e inferior para todos los textos
      alignment: 'justify',
    },
    },
    defaultStyle: {
      font: "Helvetica",
      color: "#616161",
    },
    pageMargins: [40, 30, 40, 30],
  };
}

module.exports = { liquidacionTemplatev2 };
