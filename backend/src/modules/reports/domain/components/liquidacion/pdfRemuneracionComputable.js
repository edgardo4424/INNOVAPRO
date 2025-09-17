const { planilla_mensual } = require("../../../../../database/models");

function pdfRemuneracionComputable({data}) {

const body = data.map(item => [item.label, { text: item.valor, alignment: "right" }]);

  return {
    table: {
      widths: ["*", 100],
      body: [
        [{ text: "REMUNERACIÓN COMPUTABLE", colSpan: 2, bold: true }, {}],
        ...body,
      ],
    },
    layout: "lightHorizontalLines",
    margin: [0, 0, 0, 10],
  };
}
module.exports = { pdfRemuneracionComputable };
