const { construirMensajeTiempo } = require("../../../utils/construirMensajeTiempo");

function pdfSeccionGratificacion({gratificacion}) {

   console.log('gratificacion', gratificacion);
  const mensaje_gratificacion_tiempo_computado = construirMensajeTiempo({meses: gratificacion.meses_computables});

  console.log('gratificacion.adelantos', gratificacion.adelantos);
  return {
   /*  table: {
      widths: ["*", 100],
      body: [
        [{ text: `GRATIFICACIÓN TRUNCA: ${mensaje_gratificacion_tiempo_computado}`, style: "tableSectionTitle", }, {}],
        ["PERIODO", { text: gratificacion.periodo, alignment: "right" }],
        [{text: "TOTAL", bold: true}, { text: Number(gratificacion.total_pagar).toFixed(2), alignment: "right" }],
      ],
    },
    layout: "lightHorizontalLines",
    style: "infoTable", 
    margin: [0, 0, 0, 10], */
    stack: [
      {
        text: `GRATIFICACIÓN TRUNCA: ${mensaje_gratificacion_tiempo_computado}`,
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
                    ["Sueldo Base", { text: Number(gratificacion.sueldo_base).toFixed(2), alignment: "right" }],
                    ["Asignación Familiar", { text: Number(gratificacion.asignacion_familiar).toFixed(2), alignment: "right" }],
                    ["Promedio Horas Extras", { text: Number(gratificacion.promedio_horas_extras).toFixed(2), alignment: "right" }],
                    ["Promedio Bonos", { text: Number(gratificacion.promedio_bono_obra).toFixed(2), alignment: "right" }],
                    ["TOTAL", { text: Number(gratificacion.remuneracion_computable).toFixed(2), alignment: "right", bold: true }],
                  ]
                },
                layout: "lightHorizontalLines",
                style: "infoTable",
                margin: [0, 0, 0, 10],
              },
            ]
          },
          {
            width: '40%',
            stack: [
              {
                table: {
                  widths: ["auto", '*'],
                  body: [
                    [{ text: "CÁLCULO GRATIFICACIÓN", colSpan: 2, style: "tablaHeader" }, {}],
                    ["Por los meses", { text: Number(gratificacion.gratificacion_bruta).toFixed(2), alignment: "right" }],
                    ["Bonificacion Essalud", { text: Number(gratificacion.bonificacion_extraordinaria).toFixed(2), alignment: "right" }],
                    ["Faltas (descuento)", { text: `-${Number(gratificacion.faltas_monto).toFixed(2)}`, alignment: "right" }],
                    ["No computable", { text: `-${Number(gratificacion.no_computable).toFixed(2)}`, alignment: "right" }],
                    ["Descuentos No domiciliado", { text: `-${Number(gratificacion.renta_5ta).toFixed(2)}`, alignment: "right" }],
                    ["Adelantos", { text: `-${Number(gratificacion.adelantos).toFixed(2)}`, alignment: "right" }],
                    [{ text: "TOTAL GRATIFICACIÓN", bold: true }, {
                      text: Number(gratificacion.total_pagar).toFixed(2),
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
module.exports = { pdfSeccionGratificacion };
