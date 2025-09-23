const { construirMensajeTiempo } = require("../../../utils/construirMensajeTiempo");
const SequelizeAsistenciaRepository = require("../../../../asistencias/infraestructure/repositories/sequelizeAsistenciaRepository");
const asistenciaRepository = new SequelizeAsistenciaRepository();
const moment = require("moment");

async function pdfInfoTrabajador({
  trabajador,
  contrato,
  detalle_liquidacion,
  planilla_mensual,
}) {
  // !Montos para la remuneracion computable
  const monto_horas_extras =
    planilla_mensual.h_extras_primera_quincena +
    planilla_mensual.h_extras_segunda_quincena;

  const monto_bonos =
    planilla_mensual.bono_primera_quincena +
    planilla_mensual.bono_segunda_quincena;

  const total_remuneracion_computable =
    planilla_mensual.sueldo_basico +
    planilla_mensual.asig_fam +
    monto_horas_extras +
    monto_bonos;

  //! Construye texto desde años, meses, dias
  
  const mensaje_tiempo_laborado = construirMensajeTiempo(
    detalle_liquidacion.tiempo_laborado
  );
  const mensaje_tiempo_computado = construirMensajeTiempo(
    detalle_liquidacion.tiempo_computado
  );

  //! Calcular faltas injustificadas

  //* Calcular la fecha del primer dia en base a la fecha_baja
    const primerDia = moment(detalle_liquidacion.fecha_baja).startOf('month').format('YYYY-MM-DD');
  
  const faltas_injustificadas = await asistenciaRepository.obtenerCantidadFaltasPorRangoFecha( trabajador.id ,primerDia, detalle_liquidacion.fecha_baja) ?? 0;

  return {
    columns: [
      {
        width: "65%",
        stack: [
          {
            text: "DATOS DEL TRABAJADOR",
            style: "tableSectionTitle",
            margin: [0, 0, 0, 5],
          },
          {
            table: {
              widths: ["50%", "*"],
              body: [
                [
                  "NOMBRE COMPLETO",
                  trabajador.nombres + " " + trabajador.apellidos,
                ],
                [trabajador.tipo_documento, trabajador.numero_documento],
                ["FECHA DE INGRESO", detalle_liquidacion.fecha_ingreso],
                ["FECHA DE CESE", detalle_liquidacion.fecha_baja],
                ["MOTIVO DE CESE", detalle_liquidacion.motivo],
                /* ["BANCO", contrato.banco],
                ["NÚMERO DE CUENTA", contrato.numero_cuenta], */
                ["TIEMPO DE SERVICIO", mensaje_tiempo_laborado],
                ["FALTAS INJUSTIFICADAS", faltas_injustificadas],
                ["PERIODO COMPUTABLE", mensaje_tiempo_computado],
                ["REMUNERACIÓN COMPUTABLE", Number(total_remuneracion_computable).toFixed(2)],
              ],
            },
            layout: "noBorders",
            style: "infoTable", // Aplica estilo general si deseas
          },
        ],
      },
      {
        width: "*",
        stack: [
          {
            text: "REMUNERACIÓN COMPUTABLE",
            style: "tableSectionTitle",
            decoration: "underline",
            /*   decorationColor: "black", */
            margin: [0, 0, 0, 5],
          },
          {
            table: {
              widths: ["auto", "*"],
              body: [
                [
                  "ULT. SUELDO",
                  {
                    text: Number(contrato.sueldo).toFixed(2),
                    alignment: "right",
                  },
                ],
                [
                  "ASIGN. FAMILIAR",
                  {
                    text: Number(planilla_mensual.asig_fam).toFixed(2),
                    alignment: "right",
                  },
                ],
                [
                  "MONTO HORAS EXTRAS",
                  {
                    text: Number(monto_horas_extras).toFixed(2),
                    alignment: "right",
                  },
                ],
                [
                  "MONTO BONOS",
                  {
                    text: Number(monto_bonos).toFixed(2),
                    alignment: "right",
                  },
                ],
                [
                  "TOTAL REMUNERACIÓN",
                  {
                    text: Number(total_remuneracion_computable).toFixed(2),
                    alignment: "right",
                  },
                ],
              ],
            },
            style: "infoTable", // Aplica estilo general si deseas
          },
        ],
      },
    ],
    columnGap: 10,
  };
}
module.exports = { pdfInfoTrabajador };
