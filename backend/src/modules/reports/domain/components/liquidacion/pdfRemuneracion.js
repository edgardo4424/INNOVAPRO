
const moment = require("moment");

function pdfSeccionRemuneracion({ planilla_mensual, detalle_liquidacion  }) {
  console.log("planilla_mensual", planilla_mensual);

  const monto_horas_extras =
    planilla_mensual.h_extras_primera_quincena +
    planilla_mensual.h_extras_segunda_quincena;
  const monto_bonos =
    planilla_mensual.bono_primera_quincena +
    planilla_mensual.bono_segunda_quincena;
  const monto_faltas =
    planilla_mensual.faltas_primera_quincena +
    planilla_mensual.faltas_segunda_quincena;
  const monto_tardanzas =
    planilla_mensual.tardanza_primera_quincena +
    planilla_mensual.tardanza_segunda_quincena;

    //! Calcular la fecha del primer dia en base a la fecha_baja
  const primerDia = moment(detalle_liquidacion.fecha_baja).startOf('month').format('YYYY-MM-DD');

    console.log('monto_tardanzas', monto_tardanzas);

  let sistema_pension = "";
  let descuento_ley = 0;

  switch (planilla_mensual.tipo_contrato) {
    case "PLANILLA":
      if (planilla_mensual.afp == "ONP") {
        sistema_pension = "ONP";
        descuento_ley = Number(planilla_mensual.onp);
      } else {
        sistema_pension = `AFP ${planilla_mensual.afp}`;
        descuento_ley =
          Number(planilla_mensual.afp_ap_oblig) +
          Number(planilla_mensual.seguro) +
          Number(planilla_mensual.comision);
      }
      break;
    default:
      break;
  }

  const remuneracion_computable =
    Number(planilla_mensual.sueldo_del_mes) +
    Number(planilla_mensual.asig_fam) +
    monto_horas_extras +
    monto_bonos;

  return {
    /*  table: {
      widths: ["*", 100],
      body: [
        [{ text: "REMUNERACIÓN ÚLTIMO MES", colSpan: 2, bold: true }, {}],
        ["DÍAS LABORADOS", { text: planilla_mensual.dias_labor, alignment: "right" }],
        ["MONTO", { text: Number(planilla_mensual.saldo_por_pagar).toFixed(2), alignment: "right" }],
      ],
    },
    layout: "lightHorizontalLines",
    margin: [0, 0, 0, 10], */

    stack: [
      {
        text: `REMUNERACIÓN ÚLTIMO MES: ${primerDia} al ${detalle_liquidacion.fecha_baja}`,
        style: "tableSectionTitle",
        margin: [0, 0, 0, 5],
      },
      {
        columns: [
          {
            width: "60%",
            stack: [
              {
                table: {
                  widths: ["auto", "*"],
                  body: [
                    [
                      {
                        text: "REMUNERACIÓN COMPUTABLE",
                        colSpan: 2,
                        style: "tablaHeader",
                      },
                      {},
                    ],
                    [
                      "Sueldo Del Mes",
                      {
                        text: Number(planilla_mensual.sueldo_del_mes).toFixed(2),
                        alignment: "right",
                      },
                    ],
                    [
                      "Asignación Familiar",
                      {
                        text: Number(planilla_mensual.asig_fam).toFixed(2),
                        alignment: "right",
                      },
                    ],
                    [
                      "Monto Bonos",
                      {
                        text: Number(monto_horas_extras).toFixed(2),
                        alignment: "right",
                      },
                    ],
                    [
                      "Monto Horas Extras",
                      {
                        text: Number(monto_bonos).toFixed(2),
                        alignment: "right",
                      },
                    ],
                    [
                      "TOTAL",
                      {
                        text: Number(remuneracion_computable).toFixed(2),
                        alignment: "right",
                        bold: true,
                      },
                    ],
                  ],
                },
                layout: "lightHorizontalLines",
                style: "infoTable",
                margin: [0, 0, 0, 10],
              },
            ],
          },
          {
            width: "40%",
            stack: [
              {
                table: {
                  widths: ["auto", "*"],
                  body: [
                    [{ text: "CÁLCULO", colSpan: 2, style: "tablaHeader" }, {}],
                    [
                      "Remuneración Computable",
                      {
                        text: Number(remuneracion_computable).toFixed(2),
                        alignment: "right",
                      },
                    ],
                    [
                      "Descanso Médico",
                      {
                        text: Number(planilla_mensual.descanso_medico).toFixed(
                          2
                        ),
                        alignment: "right",
                      },
                    ],
                    [
                      "Licencia Con Goce de Haber",
                      {
                        text: `-${Number(
                          planilla_mensual.licencia_con_goce_de_haber
                        ).toFixed(2)}`,
                        alignment: "right",
                      },
                    ],
                    [
                      "Vacaciones",
                      {
                        text: `-${Number(planilla_mensual.vacaciones).toFixed(
                          2
                        )}`,
                        alignment: "right",
                      },
                    ],
                    [
                      "Licencia Sin Goce de Haber",
                      {
                        text: `-${Number(
                          planilla_mensual.licencia_sin_goce_de_haber
                        ).toFixed(2)}`,
                        alignment: "right",
                      },
                    ],
                    [
                      "Faltas (descuento)",
                      {
                        text: `-${Number(monto_faltas).toFixed(2)}`,
                        alignment: "right",
                      },
                    ],
                    [
                      "Tardanzas (descuento)",
                      {
                        text: `-${Number(monto_tardanzas).toFixed(2)}`,
                        alignment: "right",
                      },
                    ],
                    [
                      "5ta Categoría (descuento)",
                      {
                        text: `-${Number(planilla_mensual.quinta_categoria).toFixed(2)}`,
                        alignment: "right",
                      },
                    ],
                      [
                      `Descuentos de Ley (${sistema_pension})`,
                      {
                        text: `-${Number(descuento_ley).toFixed(2)}`,
                        alignment: "right",
                      },
                    ],
                    [
                      "Adelantos",
                      {
                        text: `-${Number(planilla_mensual.adelanto_prestamo).toFixed(2)}`,
                        alignment: "right",
                      },
                    ],
                      [
                      "Sueldo quincenal",
                      {
                        text: `-${Number(planilla_mensual.sueldo_quincenal).toFixed(2)}`,
                        alignment: "right",
                      },
                    ],
                    [
                      { text: "TOTAL REMUNERACIÓN", bold: true },
                      {
                        text: Number(planilla_mensual.saldo_por_pagar).toFixed(2),
                        alignment: "right",
                        bold: true,
                      },
                    ],
                  ],
                },
                layout: "lightHorizontalLines",
                style: "infoTable",
              },
            ],
          },
        ],
        columnGap: 15,
      },
    ],
    margin: [0, 0, 0, 10],
  };
}
module.exports = { pdfSeccionRemuneracion };
