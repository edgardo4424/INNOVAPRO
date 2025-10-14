const formatearFecha = require("../../../../../shared/utils/formatearFecha");
const { redondear2 } = require("../../../../../shared/utils/redondear2");
const {
  construirMensajeTiempo,
} = require("../../../utils/construirMensajeTiempo");

function pdfSeccionCtsTrunca({ contrato, detalles_liquidacion }) {
  const { ctsTrunca, informacionLiquidacion } = detalles_liquidacion;

    if(ctsTrunca == null) return; 

  const mensaje_cts_tiempo_computado = construirMensajeTiempo({
    meses: ctsTrunca.meses_computados,
    dias: ctsTrunca.dias_computados,
  });

  const promGrat = redondear2(ctsTrunca.promedio_gratificacion);

  const remuneracion_computable = redondear2(informacionLiquidacion.remuneracion_computable);

  const totalRemu = redondear2(remuneracion_computable + promGrat);
  
  const totalMeses = redondear2(ctsTrunca.calculoCtsTruncaMeses) || 0;
  const totalDias = redondear2(ctsTrunca.calculoCtsTruncaDias) || 0;
  const totalFinal = redondear2(totalMeses + totalDias);

  // Decoration underline
  let decorationUnderlineMeses = false;
  let decorationUnderlineDias = false;

  if(ctsTrunca.meses_computados != 0) {
    decorationUnderlineMeses = true;
  }
  if(ctsTrunca.dias_computados != 0) {
    decorationUnderlineMeses = false;
    decorationUnderlineDias = true;
  }

  const ultimaFechaDeposito = ctsTrunca?.ultimaFechaDeposito || null;
  const ultimoBancoDeposito = ctsTrunca?.ultimoBancoDeposito || null;

  let divisorDelRegimen;

  switch (contrato.regimen) {
    case "MYPE":
      divisorDelRegimen = 2;
      break;
    case "GENERAL":
      divisorDelRegimen = 1;
      break;
    default:
      break;
  }


  return {
    stack: [
      // Cabecera
      {
        columns: [
          {
            width: "65%",
            stack: [
              {
                text: `CTS TRUNCA: ${mensaje_cts_tiempo_computado}`,
                style: "tableSectionTitle",
              },
            ],
          },
          {
            width: "*",
            stack: [
              {
                text: `S/ ${totalFinal.toFixed(2)}`,
                alignment: "right",
                bold: true,
                fontSize: 9,
              },
            ],
          },
        ],
        margin: [0, 0, 0, 5],
      },
      // Subcabecera
      {
        text: (ultimoBancoDeposito && ultimaFechaDeposito)
          ? `Depositado al ${ultimoBancoDeposito} el ${formatearFecha(ultimaFechaDeposito)}`
          : '',
        style: "infoTable",
        bold: true,
        margin: (ultimoBancoDeposito && ultimaFechaDeposito) ? [0, 0, 0, 8] : [0, 0, 0, 0],
      },
      // Remuneración computable
      {
        columns: [
          {
            width: "65%",
            stack: [
              {
                table: {
                  widths: ["33.33%", "33.33%", "*"],
                  body: [
                    [
                      {
                        text: "REMUNERACION COMPUTABLE:",
                        colSpan: 2,
                        bold: true,
                      },
                      {},
                    ],
                    ["SUELDO:", { text: remuneracion_computable.toFixed(2), alignment: "right" }],
                    ...(promGrat !== "0.00"
                      ? [
                          [
                            "PROM. GRAT.:",
                            { text: promGrat.toFixed(2), alignment: "right", decoration: "underline" },
                            
                          ],
                        ]
                      : []),
                    [
                      "TOTAL",
                      {
                        text: totalRemu.toFixed(2),
                        alignment: "right",
                        bold: true,
                      },
                    ],
                  ],
                },
                layout: "noBorders",
                margin: [0, 0, 0, 10],
                style: "infoTable",
              },
              {
                table: {
                  widths: ["33.33%", "33.33%", "*"],
                  body: [
                    ...(ctsTrunca.meses_computados == 0
                      ? []
                      : [
                          [
                            { text: "POR LOS MESES" },
                            {
                              text: `S/ ${totalRemu.toFixed(2)} ${contrato.regimen == "MYPE" ? `/ ${divisorDelRegimen} `: ''}/ 12 x ${ctsTrunca.meses_computados} MESES`, alignment: "right",
                            },
                            { text: totalMeses.toFixed(2), alignment: "right", decoration: decorationUnderlineMeses ? "underline" : null },
                          ],
                        ]),
                    ...(ctsTrunca.dias_computados == 0
                      ? []
                      : [
                          [
                            { text: "POR LOS DIAS" },
                            {
                              text: `S/ ${totalRemu.toFixed(2)} ${contrato.regimen == "MYPE" ? `/ ${divisorDelRegimen} `: ''}/ 12 / 30 x ${ctsTrunca.dias_computados} DIAS`,
                              alignment: "right",
                            },
                            {
                              text: totalDias.toFixed(2),
                              alignment: "right",
                              decoration: decorationUnderlineDias ? "underline" : null
                            },
                          ],
                        ]),
                    [
                      "",
                      "",
                      { text: totalFinal.toFixed(2), alignment: "right", bold: true },
                    ],
                  ],
                },
                layout: "noBorders",
                style: "infoTable",
              },
            ],
          },
          // Detalle cálculo
        ],
      },
    ],
    margin: [0, 0, 0, 10],
  };
}

module.exports = { pdfSeccionCtsTrunca };
