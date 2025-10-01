const formatearFecha = require("../../../../../shared/utils/formatearFecha");
const { redondear2 } = require("../../../../../shared/utils/redondear2");
const {
  construirMensajeTiempo,
} = require("../../../utils/construirMensajeTiempo");

function pdfRemuneracionTrunca({ detalles_liquidacion, trabajador, contrato }) {
  const { informacionLiquidacion, remuneracion_trunca } = detalles_liquidacion;

  if(remuneracion_trunca == null) return

  const sueldoBase = redondear2(contrato.sueldo);

  const sueldoBaseRemuneracion = redondear2(
    remuneracion_trunca.sueldo_base_remuneracion
  );

  const asignacion_familiar = redondear2(
    informacionLiquidacion.asignacion_familiar
  );

  const montoFaltas = redondear2(remuneracion_trunca?.monto_dias_faltas_y_no_computados);

  
  const descuento_planilla_quincenal = redondear2(
    remuneracion_trunca.descuento_planilla_quincenal
  )

  const subtotalRemuneracionTrunca = redondear2(
    sueldoBaseRemuneracion + asignacion_familiar - montoFaltas - descuento_planilla_quincenal
  );

  const descuento_ley = redondear2(remuneracion_trunca.descuentos_ley);


  const totalFinal = redondear2(subtotalRemuneracionTrunca - descuento_ley);

  let sistema_pension = "";

  switch (trabajador.sistema_pension) {
    case "AFP":
      sistema_pension = `AFP ${trabajador.tipo_afp}`;
      break;
    case "ONP":
      sistema_pension = `ONP`;
      break;
    default:
      break;
  }

  let decorationUnderlineSueldo = false;
  let decorationUnderlineAsignacionFamiliar = false;
  let decorationUnderlinePlanillaQuincenal = false;
  let decorationUnderlineFaltas = false;

  if (sueldoBaseRemuneracion != 0) {
    decorationUnderlineSueldo = true;
  }

  if (asignacion_familiar != 0) {
    decorationUnderlineSueldo = false;
    decorationUnderlineAsignacionFamiliar = true;
  }
  
  if(descuento_planilla_quincenal != 0){
    decorationUnderlineSueldo = false;
    decorationUnderlineAsignacionFamiliar = false;
    decorationUnderlinePlanillaQuincenal = true;
  }

  if (montoFaltas != 0) {
    decorationUnderlineSueldo = false;
    decorationUnderlineAsignacionFamiliar = false;
    decorationUnderlinePlanillaQuincenal = false;
    decorationUnderlineFaltas = true;
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
                text: `REMUNERACIÓN: ${formatearFecha(remuneracion_trunca?.fechaInicioRemuneracion)} al ${formatearFecha(remuneracion_trunca?.fechaFinRemuneracion)}`,
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
                      { text: "SUELDO" },
                      {
                        text: `S/ ${sueldoBase.toFixed(2)} / 30 x ${remuneracion_trunca.dias_laborados}`,
                        alignment: "right",
                      },
                      {
                        text: sueldoBaseRemuneracion.toFixed(2),
                        alignment: "right",
                        decoration: decorationUnderlineSueldo
                          ? "underline"
                          : null,
                      },
                    ],
                    ...(asignacion_familiar == 0
                      ? []
                      : [
                          [
                            { text: "ASIGNACIÓN FAMILIAR", colSpan: 2 },
                            {},
                            {
                              text: asignacion_familiar.toFixed(2),
                              alignment: "right",
                              decoration: decorationUnderlineAsignacionFamiliar
                                ? "underline"
                                : null,
                            },
                          ],
                        ]),

                        ...(descuento_planilla_quincenal == 0
                      ? []
                      : [
                          [
                            { text: "DESCUENTO PLANILLA QUINCENAL", colSpan: 2 },
                            {},
                            {
                              text: `-${descuento_planilla_quincenal.toFixed(2)}`,
                              alignment: "right",
                              decoration: decorationUnderlinePlanillaQuincenal
                                ? "underline"
                                : null,
                            },
                          ],
                        ]),


                    ...(montoFaltas == 0
                      ? []
                      : [
                          [
                            {
                              text: `FALTA ${remuneracion_trunca.dias_faltas_y_no_computados} días`,
                            },
                            {},
                            {
                              text: `-${montoFaltas.toFixed(2)}`,
                              alignment: "right",
                              decoration: decorationUnderlineFaltas
                                ? "underline"
                                : null,
                            },
                          ],
                        ]),
                    [
                      {},
                      {},
                      {
                        text: subtotalRemuneracionTrunca.toFixed(2),
                        alignment: "right",
                        bold: true,
                      },
                    ],
                    [
                      {
                        text: `DSCTO. DE LEY`,
                        bold: true,
                      },
                      {},
                      {},
                    ],
                    [
                      {
                        text: `${sistema_pension}`,
                      },
                      {
                        text: `S/ ${subtotalRemuneracionTrunca.toFixed(2)} x ${informacionLiquidacion.porcentaje_descuento_sistema_pension} %`,
                        alignment: "right",
                      },
                      {
                        text: `-${descuento_ley.toFixed(2)}`,
                        alignment: "right",
                        bold: true,
                        decoration: "underline",
                      },
                    ],
                    [
                      {},
                      {},
                      {
                        text: totalFinal.toFixed(2),
                        alignment: "right",
                        bold: true,
                      },
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

module.exports = { pdfRemuneracionTrunca };