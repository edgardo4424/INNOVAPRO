const { calcularMesesComputablesSemestre, obtenerUltimaFechaFin } = require("./calcularMesesComputablesSemestre");
const { calcularResumenGratificaciones } = require("./calcularResumenGratificaciones");
const { mapearParaReporteGratificaciones } = require("./mapearParaReporteGratificaciones");
const { obtenerFechasInicioFinParaCalculo } = require("./obtenerFechasInicioFinParaCalculo");

const SequelizeAsistenciaRepository = require("../../../asistencias/infraestructure/repositories/sequelizeAsistenciaRepository");
const SequelizeBonoRepository = require("../../../bonos/infraestructure/repositories/sequelizeBonoRepository");
const SequelizeAdelantoSueldoRepository = require("../../../adelanto_sueldo/infraestructure/repositories/sequlizeAdelantoSueldoRepository");
const calcularPromedioHorasExtras = require("../../../../services/calculoHorasEsxtras");
const calculaPromedioBonos = require("../../../../services/calculoBonos");
const { mapearInfoDetalleGratificacion } = require("./mapearInfoDetalleGratificacion");

const asistenciaRepository = new SequelizeAsistenciaRepository();
const bonoRepository = new SequelizeBonoRepository();
const adelantoSueldoRepository = new SequelizeAdelantoSueldoRepository();

async function calcularComponentesGratificaciones(contratos, periodo, anio, dataMantenimiento) {

    // Agrupar por trabajador
    const porTrabajador = new Map();
    for (const c of contratos) {
      const tid = c.trabajador_id;
      if (!porTrabajador.has(tid))
        porTrabajador.set(tid, { trabajador: c.trabajador, contratos: [] });
     
      porTrabajador.get(tid).contratos.push(c.get({ plain: true }));
    }

    const filas = await Promise.all(
      Array.from(porTrabajador.values()).map(
        async ({ trabajador, contratos }) => {

          // Obtener los contratos limpios
          

          //console.log('contratos del trabajador', contratos);
          // 1) Meses por régimen
          const { porRegimen, totalMeses, detalleMensual } =
            calcularMesesComputablesSemestre(contratos, periodo, anio);

          const ultimaFechaFinContrato = obtenerUltimaFechaFin(contratos);


          // Nota: si el sueldo_base cambia por contrato, ya viene por cada parte (porRegimen.sueldo_base).
          // Aquí RC se arma por parte con su sueldo_base específico:
          const partes = await Promise.all(
            porRegimen.map(async (p) => {
              // Calcular fechaInicio y fechaFin para calcular horas extras, bonos, cantidad faltas y dias no computables del semestre
              // Si el periodo es JULIO y la fecha de inicio no entra en el semestre,
              // se toma la fecha de inicio del siguiente semestre.

              const { fechaInicioCalculo, fechaFinCalculo } =
                obtenerFechasInicioFinParaCalculo(
                  periodo,
                  anio,
                  p.fecha_inicio,
                  p.fecha_fin
                );



              //const promedioBonoObra = Number((bonoTotalDelTrabajador / p.meses).toFixed(2));

              const bonosDelTrabajadorPorFecha =
                await bonoRepository.obtenerBonosDelTrabajadorEnRango(
                  trabajador.id,
                  fechaInicioCalculo,
                  fechaFinCalculo
                );
              const asistencias =
                await asistenciaRepository.obtenerAsistenciasPorRangoFecha(
                  trabajador.id,
                  fechaInicioCalculo,
                  fechaFinCalculo
                );

              const bonosDelTrabajador = bonosDelTrabajadorPorFecha.map(
                (b) => b.dataValues
              );
              const asistenciasDelTrabajador = asistencias.map(
                (b) => b.dataValues
              );

              const promedioBonoObra = calculaPromedioBonos(
                bonosDelTrabajador,
                6
              );
              const promedioHorasExtras = calcularPromedioHorasExtras(
                asistenciasDelTrabajador,
                dataMantenimiento.MONTO_POR_HORA_EXTRA,
                6
              );

              const faltasDias =
                await asistenciaRepository.obtenerCantidadFaltasPorRangoFecha(
                  trabajador.id,
                  fechaInicioCalculo,
                  fechaFinCalculo
                ); // Falta calcular la cantidad de faltas

              const diasNoComputables =
                await asistenciaRepository.obtenerDiasNoComputablesPorRangoFecha(
                  trabajador.id,
                  fechaInicioCalculo,
                  fechaFinCalculo
                );

              const noComputable = diasNoComputables * dataMantenimiento.MONTO_NO_COMPUTABLE;

              // Asignacion familiar
              const asignacionFamiliar =
                (trabajador.asignacion_familiar &&
                (new Date(trabajador.asignacion_familiar) <= new Date(fechaFinCalculo)))
                  ? dataMantenimiento.MONTO_ASIGNACION_FAMILIAR
                  : 0;

              const RC = +(
                p.sueldo_base +
                asignacionFamiliar +
                promedioHorasExtras +
                promedioBonoObra
              ).toFixed(2);
              const gratiBruta = +(RC * p.factor * (p.meses / 6)).toFixed(2);

              // Monto por faltas
              const totalFaltasMonto = Number(
                ((p.sueldo_base / 6 / 30) * faltasDias).toFixed(2)
              );

              // Faltas: si llevaras por mes, podrías repartir por proporción de meses

              // const gratiNeta = +Math.max(0, gratiBruta - faltasMonto).toFixed(2);

              const gratiNeta = gratiBruta - totalFaltasMonto - noComputable;

              const bonifPct = dataMantenimiento.PORCENTAJE_BONIFICACION_ESSALUD / 100;
              const bonificacion = +(gratiNeta * bonifPct).toFixed(2);

              let renta5ta = 0; // Verificar si califica renta 5ta categoria No domiciliado

              if (!trabajador.domiciliado) {
                renta5ta = +(
                  gratiNeta *
                  (dataMantenimiento.PORCENTAJE_DESCUENTO_5TA_CATEGORIA_NO_DOMICILIADO / 100)
                ).toFixed(2);
              }

              const {totalAdelantosSueldo, adelantos_ids} =
                await adelantoSueldoRepository.obtenerTotalAdelantosDelTrabajadorPorRangoFecha(
                  trabajador.id,
                  "gratificacion",
                  /* fechaInicioCalculo,
                  fechaFinCalculo, */
                  null // fecha_anio_mes_dia
                );


              const total = +(
                gratiNeta +
                bonificacion -
                (renta5ta + totalAdelantosSueldo)
              ).toFixed(2);

              const fechaFin =
                contratos.length == 1
                  ? ultimaFechaFinContrato
                  : p.fecha_terminacion_anticipada || p.fecha_fin;

                 

              // Obtener los contratos que esta dentro del rango p.fecha_inicio y fechaFin

              let fechaInicioPeriodo = null;
              let fechaFinPeriodo = null;

              switch (periodo) {
                case "JULIO":
                  fechaInicioPeriodo = `${anio}-01-01`;
                  fechaFinPeriodo = `${anio}-06-30`;
                  break;
                case "DICIEMBRE":
                  fechaInicioPeriodo = `${anio}-07-01`;
                  fechaFinPeriodo = `${anio}-12-31`;
                  break;
                default:
                  break;
              }

              const contratosQueCumplen = contratos.filter((c) => {
                const inicio = new Date(c.fecha_inicio);
                const fin = new Date(c.fecha_terminacion_anticipada || c.fecha_fin);
                return inicio <= new Date(fechaFinPeriodo) && fin >= new Date(fechaInicioPeriodo);
              })

              const lista_id_contratos = contratosQueCumplen.map((c) => c.id);


              const banco = contratosQueCumplen[contratosQueCumplen.length - 1].banco || ""
              const numeroCuenta= contratosQueCumplen[contratosQueCumplen.length - 1].numero_cuenta || ""

              const info_detalle = mapearInfoDetalleGratificacion({asistencias: asistenciasDelTrabajador, bonos: bonosDelTrabajador});

              return {
                tipo_contrato: p.tipo_contrato,
                regimen: p.regimen,
                fecha_inicio: p.fecha_inicio, // NUEVO CAMPO
                fecha_fin: fechaFin,
                meses: p.meses,
                factor: p.factor,
                sistema_salud: p.sistema_salud,
                sueldo_base: p.sueldo_base,
                asignacion_familiar: asignacionFamiliar,
                promedio_horas_extras: promedioHorasExtras,
                promedio_bono_obra: promedioBonoObra,
                rc: RC,
                gratificacion_bruta: gratiBruta,
                faltas_dias: faltasDias,
                faltas_monto: totalFaltasMonto,
                no_computable: noComputable,
                gratificacion_neta: gratiNeta,
                bonificacion_extraordinaria: bonificacion,
                renta_5ta: renta5ta,
                adelantos: totalAdelantosSueldo,
                total,

                banco: banco,
                numero_cuenta: numeroCuenta,
                lista_contratos_ids: lista_id_contratos,
                data_mantenimiento_detalle: dataMantenimiento,
                info_detalle: info_detalle,
                adelantos_ids: adelantos_ids
              };
            })
          );


          // 3) Consolidado (sumas de partes)
          const sum = (k) => partes.reduce((a, x) => a + Number(x[k] || 0), 0);
          const consolidado = {
            meses_computables: totalMeses,
            gratificacion_bruta: +sum("gratificacion_bruta").toFixed(2),
            gratificacion_neta: +sum("gratificacion_neta").toFixed(2),
            bonificacion_extraordinaria: +sum(
              "bonificacion_extraordinaria"
            ).toFixed(2),
            total: +sum("total").toFixed(2),
          };

          return {
            tipo_documento: trabajador.tipo_documento,
            numero_documento: trabajador.numero_documento,
            nombres: trabajador.nombres,
            apellidos: trabajador.apellidos,
            trabajador_id: trabajador.id,
            //detalle_mensual: detalleMensual,   // opcional para auditoría/UI
            partes_por_regimen: partes, // <-- aquí tienes MYPE vs GENERAL separados
            consolidado,
          };
        }
      )
    );

    // Si quieres seguir separando por tipo de contrato (planilla/honorario),
    // puedes mirar en cada fila sus partes_por_regimen[*].tipo_contrato,
    // y clonar la lógica de resúmenes que ya tenías.

    const listaTrabajadoresPlanilla = mapearParaReporteGratificaciones(filas);

    const totalesPlanilla = calcularResumenGratificaciones(
      listaTrabajadoresPlanilla
    );


    return {
      planilla: {
        trabajadores: listaTrabajadoresPlanilla,
        totales: listaTrabajadoresPlanilla.length > 0 ? totalesPlanilla : null,
      },
    };
}

module.exports = {calcularComponentesGratificaciones}