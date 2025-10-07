const { redondear2 } = require("../../../../../shared/utils/redondear2");
const {
  construirMensajeTiempo,
} = require("../../../utils/construirMensajeTiempo");

function pdfSeccionVacaciones({ contrato, detalles_liquidacion, trabajador }) {
  const { informacionLiquidacion, vacacionesTrunca } = detalles_liquidacion;

  if(vacacionesTrunca == null) return; 

  const mensaje_vacaciones_tiempo_computado = construirMensajeTiempo({
    anios: vacacionesTrunca.anios_computados,
    meses: vacacionesTrunca.meses_computados,
    dias: vacacionesTrunca.dias_computados,
  });

  const totalRemu = Number(
    informacionLiquidacion.remuneracion_computable
  );

  const totalAnios = Number(
    vacacionesTrunca.calculoVacacionesTruncaAnios
  ) || 0;
  const totalMeses = Number(
    vacacionesTrunca.calculoVacacionesTruncaMeses
  ) || 0;
  const totalDias = Number(vacacionesTrunca.calculoVacacionesTruncaDias) || 0;

  const descuentos_vacaciones_gozadas = Number(vacacionesTrunca?.descuentos_vacaciones_gozadas) || 0;

  const subtotalVacacionesTrunca = redondear2(
    totalAnios + totalMeses + totalDias - descuentos_vacaciones_gozadas
  );

  const descuento_ley = redondear2(vacacionesTrunca.descuentos_ley);

  const totalFinal = redondear2(subtotalVacacionesTrunca - descuento_ley);

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

  let decorationUnderlineAnios = false;
   let decorationUnderlineMeses = false;
  let decorationUnderlineDias = false;
  let decorationUnderlineVacacionesGozadas = false;

   if(vacacionesTrunca.anios_computados != 0) {
    decorationUnderlineAnios = true;
  }

  if(vacacionesTrunca.meses_computados != 0) {
    decorationUnderlineAnios = false;
    decorationUnderlineMeses = true;
  }
  if(vacacionesTrunca.dias_computados != 0) {
    decorationUnderlineAnios = false;
    decorationUnderlineMeses = false;
    decorationUnderlineDias = true;
  }

  if(descuentos_vacaciones_gozadas != 0) {
    decorationUnderlineAnios = false;
    decorationUnderlineMeses = false;
    decorationUnderlineDias = false;
    decorationUnderlineVacacionesGozadas = true;
  }

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
                text: `VACACIONES TRUNCAS: ${mensaje_vacaciones_tiempo_computado}`,
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
        text: `Del ${vacacionesTrunca.fechaInicioVacaciones} al ${vacacionesTrunca.fechaFinVacaciones}`,
        style: "infoTable",
        bold: true,
        margin: [0, 0, 0, 8],
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
                    ...(vacacionesTrunca.anios_computados == 0
                      ? []
                      : [
                          [
                            { text: "POR LOS AÑOS" },
                            {
                              text: `S/ ${totalRemu.toFixed(2)} ${contrato.regimen == "MYPE" ? `/ ${divisorDelRegimen} `: ''}x ${vacacionesTrunca.anios_computados} AÑOS`,
                              alignment: "right",
                            },
                            { text: totalAnios, alignment: "right", decoration: decorationUnderlineAnios ? "underline" : null },
                          ],
                        ]),
                    ...(vacacionesTrunca.meses_computados == 0
                      ? []
                      : [
                          [
                            { text: "POR LOS MESES" },
                            {
                              text: `S/ ${totalRemu.toFixed(2)} ${contrato.regimen == "MYPE" ? `/ ${divisorDelRegimen} `: ''}/ 12 x ${vacacionesTrunca.meses_computados} MESES`,
                              alignment: "right",
                            },
                            { text: totalMeses.toFixed(2), alignment: "right", decoration: decorationUnderlineMeses ? "underline" : null },
                          ],
                        ]),
                    ...(vacacionesTrunca.dias_computados == 0
                      ? []
                      : [
                          [
                            { text: "POR LOS DIAS" },
                            {
                              text: `S/ ${totalRemu.toFixed(2)} ${contrato.regimen == "MYPE" ? `/ ${divisorDelRegimen} `: ''}/ 12 / 30 x ${vacacionesTrunca.dias_computados} DIAS`,
                              alignment: "right",
                            },
                            {
                              text: totalDias.toFixed(2),
                              alignment: "right",
                              decoration: decorationUnderlineDias? "underline" : null
                            },
                          ],
                        ]),

                    ...(vacacionesTrunca.dias_vacaciones_gozadas == 0
                      ? []
                      : [
                          [
                            {
                              text: `DESC. VACACIONES GOZADAS (${vacacionesTrunca.dias_vacaciones_gozadas} días)`, colSpan: 2, // 👈 ocupa 2 columnas
                            },
                            {},
                            {
                              text: `-${(descuentos_vacaciones_gozadas).toFixed(2)}`,
                              alignment: "right",
                              decoration: "underline",
                            },
                          ],
                        ]),
                    [
                      {},
                      {},
                      {
                        text: subtotalVacacionesTrunca.toFixed(2),
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
                        text: `S/ ${subtotalVacacionesTrunca} x ${informacionLiquidacion.porcentaje_descuento_sistema_pension} %`,
                        alignment: "right",
                      },
                      { text: `-${descuento_ley.toFixed(2)}`, alignment: "right", decoration: "underline" },
                    ],
                    [
                      {},
                      {},
                      {
                        text: totalFinal.toFixed(2),
                        alignment: "right",
                        bold: true,
                      },
                    ]
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

module.exports = { pdfSeccionVacaciones };
