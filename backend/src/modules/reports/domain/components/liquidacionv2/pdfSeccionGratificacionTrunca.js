const formatearFecha = require("../../../../../shared/utils/formatearFecha");
const { redondear2 } = require("../../../../../shared/utils/redondear2");
const {
  construirMensajeTiempo,
} = require("../../../utils/construirMensajeTiempo");

function pdfSeccionGratificacionTrunca({ contrato, detalles_liquidacion }) {
  const { gratificacionTrunca, informacionLiquidacion } = detalles_liquidacion;

  if(gratificacionTrunca == null) return; 
  const mensaje_gratificacion_tiempo_computado = construirMensajeTiempo({
    meses: gratificacionTrunca.meses_computados,
    dias: gratificacionTrunca.dias_computados,
  });

  const totalMeses = redondear2(gratificacionTrunca.gratificacion_meses) || 0;
  const totalDias = redondear2(gratificacionTrunca.gratificacion_dias) || 0;
  
  const subtotal_gratificacion = redondear2(totalMeses + totalDias);

  const bonificacion_extra = redondear2(gratificacionTrunca.bonificacion_essalud) || 0;

  const totalFinal = redondear2(subtotal_gratificacion + bonificacion_extra);

  let decorationUnderlineMeses = false;
  let decorationUnderlineDias = false;

  if(gratificacionTrunca.meses_computados != 0) {
    decorationUnderlineMeses = true;
  }
  if(gratificacionTrunca.dias_computados != 0) {
    decorationUnderlineMeses = false;
    decorationUnderlineDias = true;
  }

  const ultimaFechaDeposito = gratificacionTrunca?.ultimaFechaDeposito || null;
  const ultimoBancoDeposito = gratificacionTrunca?.ultimoBancoDeposito || null;

  console.log({
    ultimaFechaDeposito,
    ultimoBancoDeposito
  });

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
                text: `GRATIFICACIONES TRUNCAS: ${mensaje_gratificacion_tiempo_computado}`,
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
                    ...(gratificacionTrunca.meses_computados == 0
                      ? []
                      : [
                          [
                            { text: "POR LOS MESES" },
                            {
                              text: `S/ ${informacionLiquidacion.remuneracion_computable.toFixed(2)} ${contrato.regimen == "MYPE" ? `/ ${divisorDelRegimen} `: ''}/ 6 x ${gratificacionTrunca.meses_computados} MESES`, alignment: "right",
                            },
                            { text: totalMeses.toFixed(2), alignment: "right", decoration: decorationUnderlineMeses ? "underline" : null },
                          ],
                        ]),
                    ...(gratificacionTrunca.dias_computados == 0
                      ? []
                      : [
                          [
                            { text: "POR LOS DIAS" },
                            {
                              text: `S/ ${informacionLiquidacion.remuneracion_computable.toFixed(2)} ${contrato.regimen == "MYPE" ? `/ ${divisorDelRegimen} `: ''}/ 6 / 30 x ${gratificacionTrunca.dias_computados} DIAS`,
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
                      {},
                      {},
                      {
                        text: subtotal_gratificacion.toFixed(2),
                        alignment: "right",
                        bold: true,
                      },
                    ],
                    [
                       { text: "BONIF. EXTR." },
                            {
                              text: `S/ ${subtotal_gratificacion.toFixed(2)} x ${informacionLiquidacion.porcentaje_bonificacion_essalud} %`,
                              alignment: "right",
                            },
                            {
                              text: gratificacionTrunca.bonificacion_essalud.toFixed(2),
                              alignment: "right",
                              decoration: "underline",
                            },
                    ],
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

module.exports = { pdfSeccionGratificacionTrunca };
