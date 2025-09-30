const { construirMensajeTiempo } = require("../../../utils/construirMensajeTiempo");
const SequelizeAsistenciaRepository = require("../../../../asistencias/infraestructure/repositories/sequelizeAsistenciaRepository");
const asistenciaRepository = new SequelizeAsistenciaRepository();
const moment = require("moment");
const formatearFecha = require("../../../../../shared/utils/formatearFecha");

async function pdfInfoTrabajador({
  trabajador,
  contrato,
  detalles_liquidacion,
  fecha_ingreso,
  fecha_baja,
  motivo,
}) {

  const { informacionLiquidacion } = detalles_liquidacion;

  // !Montos para la remuneracion computable
  const monto_horas_extras =informacionLiquidacion?.promedio_horas_extras || 0;

  const monto_bonos =informacionLiquidacion?.promedio_bonos || 0;

  const asignacion_familiar = informacionLiquidacion.asignacion_familiar || 0;

  
  const total_remuneracion_computable =informacionLiquidacion?.remuneracion_computable || 0;


  //! Construye texto desde años, meses, dias
  
  const mensaje_tiempo_laborado = construirMensajeTiempo(
    informacionLiquidacion.tiempo_servicio
  );
  const mensaje_tiempo_computado = construirMensajeTiempo(
    informacionLiquidacion.periodo_computable
  );

  //! Calcular faltas injustificadas

  //* Calcular la fecha del primer dia en base a la fecha_baja
    const primerDia = moment(fecha_baja).startOf('month').format('YYYY-MM-DD');
  
  const faltas_injustificadas = await asistenciaRepository.obtenerCantidadFaltasPorRangoFecha( trabajador.id ,primerDia, fecha_baja) ?? 0;

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
                ["FECHA DE INGRESO", formatearFecha(fecha_ingreso)],
                ["FECHA DE CESE", formatearFecha(fecha_baja)],
                ["MOTIVO DE CESE", motivo],
                /* ["BANCO", contrato.banco],
                ["NÚMERO DE CUENTA", contrato.numero_cuenta], */
                ["TIEMPO DE SERVICIO", mensaje_tiempo_laborado],
                ["FALTAS INJUSTIFICADAS", faltas_injustificadas],
                ["PERIODO COMPUTABLE", mensaje_tiempo_computado],
                ["REMUNERACIÓN COMPUTABLE", Number(total_remuneracion_computable).toFixed(2)],
                ["REGIMEN LABORAL", contrato.regimen],
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
                    text: Number(asignacion_familiar).toFixed(2),
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
