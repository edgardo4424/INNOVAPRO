const { redondear2 } = require("../../../../../shared/utils/redondear2");

function pdfTotalAPagar({  detalles_liquidacion }) {
  const { ctsTrunca, vacacionesTrunca, gratificacionTrunca, remuneracion_trunca, descuentos_adicionales } = detalles_liquidacion;

  const totalCtsTrunca = ctsTrunca?.total || 0;
  const totalVacacionesTrunca = vacacionesTrunca?.total || 0;
  const totalGratificacionTrunca = gratificacionTrunca?.total || 0;
  const totalRemuneracionTrunca = remuneracion_trunca?.total || 0;
  const totalAdelantosSimple = descuentos_adicionales?.totalAdelantosSimple || 0
  const totalAdelantosGratificacion = descuentos_adicionales?.totalAdelantosGratificacion || 0
  const totalAdelantosCts = descuentos_adicionales?.totalAdelantosCts || 0

  const subtotalAPagar = redondear2(totalCtsTrunca + totalVacacionesTrunca + totalGratificacionTrunca + totalRemuneracionTrunca);

  const totalFinal = redondear2(subtotalAPagar - totalAdelantosSimple - totalAdelantosGratificacion - totalAdelantosCts);

  let decorationAdelantosSimple = false;
  let decorationAdelantosGratificacion = false;
  let decorationAdelantosCts = false;


  if(totalAdelantosSimple != 0) {
    decorationAdelantosSimple = true;
  }
  if(totalAdelantosGratificacion != 0) {
    decorationAdelantosSimple = false;
    decorationAdelantosGratificacion = true;
  }

  if(totalAdelantosCts != 0) {
    decorationAdelantosSimple = false;
    decorationAdelantosGratificacion = false;
    decorationAdelantosCts = true;
  }

  console.log('totalAdelantosSimple == 0',totalAdelantosSimple == 0);
  return {
    stack: [
      // Cabecera
      {
        columns: [
          {
            width: "65%",
            stack: [
              {
                text: `TOTAL A PAGAR BENEFICIOS SOCIALES`,
                style: "tableSectionTitle",
              },
            ],
          },
          {
            width: "*",
            stack: [
              {
                text: `S/ ${subtotalAPagar.toFixed(2)}`,
                alignment: "right",
                bold: true,
                fontSize: 9,
              },
            ],
          },
        ],
        margin: [0, 0, 0, 5],
      },

      {
        columns: [
          {
            width: "*",
            stack: [
              {
                table: {
                  widths: ["33.33%", "33.33%", "*"],
                  body: [
                    ...(totalAdelantosSimple == 0
                      ? []
                      : [
                          [
                            {  },
                            {
                              text: "Descuento por adelanto de sueldo de Planilla",
                              alignment: "right",
                            },
                            { text: `-${totalAdelantosSimple.toFixed(2)}`, alignment: "right", decoration: decorationAdelantosSimple ? "underline" : null },
                          ],
                        ]),
                    ...(totalAdelantosGratificacion == 0
                      ? []
                      : [
                          [
                            {  },
                            {
                              text: "Descuento por adelanto de sueldo de Gratificación",
                              alignment: "right",
                            },
                            { text: `-${totalAdelantosGratificacion.toFixed(2)}`, alignment: "right", decoration: decorationAdelantosGratificacion ? "underline" : null },
                          ],
                        ]),
                    ...(totalAdelantosCts == 0
                      ? []
                      : [
                          [
                            {  },
                            {
                              text: "Descuento por adelanto de sueldo de CTS",
                              alignment: "right",
                              
                            },
                            {
                              text: `-${totalAdelantosCts.toFixed(2)}`,
                              alignment: "right",
                              decoration: decorationAdelantosCts ? "underline" : null
                            },
                          ],
                        ]),

                    [
                      {},
                      {},
                      {
                         text: totalAdelantosSimple == 0 && totalAdelantosGratificacion == 0 && totalAdelantosCts == 0 ? '' : `S/ ${totalFinal.toFixed(2)}`,
                        alignment: "right",
                        bold: true,
                fontSize: 11,
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

module.exports = { pdfTotalAPagar };
