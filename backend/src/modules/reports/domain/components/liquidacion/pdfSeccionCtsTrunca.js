const {
  construirMensajeTiempo,
} = require("../../../utils/construirMensajeTiempo");

function pdfSeccionCtsTrunca({ cts }) {
  const mensaje_cts_tiempo_computado = construirMensajeTiempo({
    meses: cts.meses_computables,
    dias: cts.dias_computables,
  });

  return {
    stack: [
      {
        text: `CTS TRUNCA: ${mensaje_cts_tiempo_computado}`,
        style: "tableSectionTitle",
        margin: [0, 0, 0, 5],
      },
      {
        columns: [
          {
            width: '60%',
            stack: [
              {
                table: {
                  widths: ["auto", '*'],
                  body: [
                    [{ text: "REMUNERACIÓN COMPUTABLE", colSpan: 2, style: "tablaHeader" }, {}],
                    ["Sueldo Base", { text: Number(cts.sueldo_base).toFixed(2), alignment: "right" }],
                    ["Asignación Familiar", { text: Number(cts.asignacion_familiar).toFixed(2), alignment: "right" }],
                    ["Promedio Horas Extras", { text: Number(cts.promedio_horas_extras).toFixed(2), alignment: "right" }],
                    ["Promedio Bonos", { text: Number(cts.promedio_bono_obra).toFixed(2), alignment: "right" }],
                    ["TOTAL", { text: Number(cts.remuneracion_computable).toFixed(2), alignment: "right", bold: true }],
                  ]
                },
                layout: "lightHorizontalLines",
                style: "infoTable",
                margin: [0, 0, 0, 10],
              },
              {
                table: {
                  widths: ["auto", '*'],
                  body: [
                    [{ text: "PROMEDIO GRATIFICACIÓN", colSpan: 2, style: "tablaHeader" }, {}],
                    ["TOTAL", {
                      text: Number(cts.sexto_gratificacion).toFixed(2),
                      alignment: "right",
                      bold: true
                    }],
                  ]
                },
                layout: "lightHorizontalLines",
                style: "infoTable"
              }
            ]
          },
          {
            width: '40%',
            stack: [
              {
                table: {
                  widths: ["auto", '*'],
                  body: [
                    [{ text: "CÁLCULO CTS", colSpan: 2, style: "tablaHeader" }, {}],
                    ["Por los meses", { text: Number(cts.cts_meses).toFixed(2), alignment: "right" }],
                    ["Por los días", { text: Number(cts.cts_dias).toFixed(2), alignment: "right" }],
                    ["Faltas (descuento)", { text: Number(cts.faltas_importe).toFixed(2), alignment: "right" }],
                    ["No computable", { text: Number(cts.no_computable).toFixed(2), alignment: "right" }],
                    [{ text: "TOTAL CTS", bold: true }, {
                      text: Number(cts.cts_depositar).toFixed(2),
                      alignment: "right",
                      bold: true
                    }]
                  ]
                },
                layout: "lightHorizontalLines",
                style: "infoTable"
              }
            ]
          }
        ],
         columnGap: 15,
      }
    ],
    margin: [0, 0, 0, 10],
  };
}

module.exports = { pdfSeccionCtsTrunca };
