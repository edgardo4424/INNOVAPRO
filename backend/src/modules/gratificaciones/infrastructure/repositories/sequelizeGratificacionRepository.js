const db = require("../../../../database/models"); // Llamamos los modelos sequelize de la base de datos // Llamamos los modelos sequalize de la base de datos
const {
  calcularMesesComputablesSemestre,
  obtenerUltimaFechaFin,
} = require("../services/calcularMesesComputablesSemestre");
const {
  calcularResumenGratificaciones,
} = require("../services/calcularResumenGratificaciones");
const {
  mapearParaReporteGratificaciones,
} = require("../services/mapearParaReporteGratificaciones");

const SequelizeAsistenciaRepository = require("../../../asistencias/infraestructure/repositories/sequelizeAsistenciaRepository");
const SequelizeDataMantenimientoRepository = require("../../../data_mantenimiento/infrastructure/repositories/sequelizeDataMantenimientoRepository");
const SequelizeBonoRepository = require("../../../bonos/infraestructure/repositories/sequelizeBonoRepository");
const SequelizeAdelantoSueldoRepository = require("../../../adelanto_sueldo/infraestructure/repositories/sequlizeAdelantoSueldoRepository");

const asistenciaRepository = new SequelizeAsistenciaRepository();
const bonoRepository = new SequelizeBonoRepository();
const dataMantenimientoRepository = new SequelizeDataMantenimientoRepository();
const adelantoSueldoRepository = new SequelizeAdelantoSueldoRepository();

const { CierreGratificacion } = require("../models/CierreGratificacionModel");
const { Gratificacion } = require("../models/GratificacionModel");
const { obtenerFechasInicioFinParaCalculo } = require("../services/obtenerFechasInicioFinParaCalculo");


class SequelizeGratificacionRepository {
  async obtenerGratificacionesCerradas(periodo, anio, filial_id, transaction = null) {
    
     let periodoBuscar;
    switch (periodo) {
      case "JULIO":
        periodoBuscar = `${anio}-07`;
        break;
      case "DICIEMBRE":
        periodoBuscar = `${anio}-12`;
        break;
    
      default:
        break;
    }

    const cierreGratificacion = await CierreGratificacion.findOne({
      where: { periodo: periodoBuscar, filial_id }, transaction
    });
    
    const gratificacionesCerradas = await Gratificacion.findAll({
      where: { cierre_id: cierreGratificacion.id }, transaction
    });
    return gratificacionesCerradas

  }

  async calcularGratificaciones(periodo, anio, filial_id, transaction = null) {
    const MONTO_ASIGNACION_FAMILIAR = Number(
      (
        await dataMantenimientoRepository.obtenerPorCodigo(
          "valor_asignacion_familiar"
        )
      ).valor
    );
    console.log("MONTO_ASIGNACION_FAMILIAR", MONTO_ASIGNACION_FAMILIAR);

    const MONTO_FALTA_POR_DIA = Number(
      (await dataMantenimientoRepository.obtenerPorCodigo("valor_falta")).valor
    );
    console.log("MONTO_FALTA_POR_DIA", MONTO_FALTA_POR_DIA);

    const MONTO_POR_HORA_EXTRA = Number(
      (await dataMantenimientoRepository.obtenerPorCodigo("valor_hora_extra"))
        .valor
    );
    console.log("MONTO_POR_HORA_EXTRA", MONTO_POR_HORA_EXTRA);

    const MONTO_NO_COMPUTABLE = Number(
      (
        await dataMantenimientoRepository.obtenerPorCodigo(
          "valor_no_computable"
        )
      ).valor
    );
    console.log("MONTO_NO_COMPUTABLE", MONTO_NO_COMPUTABLE);

    const PORCENTAJE_BONIFICACION_ESSALUD = Number(
      (
        await dataMantenimientoRepository.obtenerPorCodigo(
          "valor_bonificacion_essalud"
        )
      ).valor
    );
    console.log(
      "PORCENTAJE_BONIFICACION_ESSALUD",
      PORCENTAJE_BONIFICACION_ESSALUD
    );

    const PORCENTAJE_DESCUENTO_5TA_CATEGORIA_NO_DOMICILIADO = Number(
      (
        await dataMantenimientoRepository.obtenerPorCodigo(
          "valor_desc_quinta_categoria_no_domiciliado"
        )
      ).valor
    );
    console.log(
      "PORCENTAJE_DESCUENTO_5TA_CATEGORIA_NO_DOMICILIADO",
      PORCENTAJE_DESCUENTO_5TA_CATEGORIA_NO_DOMICILIADO
    );

    const contratos = await db.contratos_laborales.findAll({
      where: {
        filial_id: filial_id,
        estado: true,
        tipo_contrato: "PLANILLA"
      },
      include: [
        {
          model: db.trabajadores,
          as: "trabajador",
        },
      ],
      raw: false,
      transaction
    });
   
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
          // 1) Meses por régimen
          const { porRegimen, totalMeses, detalleMensual } =
            calcularMesesComputablesSemestre(contratos, periodo, anio);
        
          // 2) Componentes comunes de RC (si RC se calcula igual para todo el semestre)
          const asignacionFamiliar = trabajador.asignacion_familiar
            ? MONTO_ASIGNACION_FAMILIAR
            : 0;

         

          const ultimaFechaFinContrato = obtenerUltimaFechaFin(contratos);

          // Nota: si el sueldo_base cambia por contrato, ya viene por cada parte (porRegimen.sueldo_base).
          // Aquí RC se arma por parte con su sueldo_base específico:
          const partes = await Promise.all(
            porRegimen.map(async (p) => {

              // Calcular fechaInicio y fechaFin para calcular horas extras, bonos, cantidad faltas y dias no computables del semestre
              // Si el periodo es JULIO y la fecha de inicio no entra en el semestre,
              // se toma la fecha de inicio del siguiente semestre.

             const {fechaInicioCalculo, fechaFinCalculo } = obtenerFechasInicioFinParaCalculo(periodo, anio, p.fecha_inicio, p.fecha_fin);


               const totalHorasExtras =
            await asistenciaRepository.obtenerHorasExtrasPorRangoFecha(
              trabajador.id,
             fechaInicioCalculo,
                  fechaFinCalculo
            );
            
          const bonoTotalDelTrabajador =
            await bonoRepository.obtenerBonoTotalDelTrabajadorPorRangoFecha(
              trabajador.id,
               fechaInicioCalculo,
                  fechaFinCalculo
            ); // TODO

            console.log({
              fechaInicio: fechaInicioCalculo,
              fechaFin: fechaFinCalculo,
              trabajador_id: trabajador.id
            });
            console.log('BONO TOTAL DEL TRABAJADOR', bonoTotalDelTrabajador);

          const promedioBonoObra = Number((bonoTotalDelTrabajador / p.meses).toFixed(2));

          console.log('promedioBonoObra', promedioBonoObra);

          //console.log('totalHorasExtras', totalHorasExtras);

          const promedioHorasExtras = Number(((totalHorasExtras * MONTO_POR_HORA_EXTRA) / p.meses).toFixed(2));

              const faltasDias =
                await asistenciaRepository.obtenerCantidadFaltasPorRangoFecha(
                  trabajador.id,
                  fechaInicioCalculo,
                  fechaFinCalculo
                ); // Falta calcular la cantidad de faltas

                const diasNoComputables = await asistenciaRepository.obtenerDiasNoComputablesPorRangoFecha(
            trabajador.id,
            fechaInicioCalculo,
            fechaFinCalculo
          )

          const noComputable = diasNoComputables * MONTO_NO_COMPUTABLE;


              const RC = +(
                p.sueldo_base +
                asignacionFamiliar +
                promedioHorasExtras +
                promedioBonoObra
              ).toFixed(2);
              const gratiBruta = +(RC * p.factor * (p.meses / 6)).toFixed(2);

              // Faltas: si llevaras por mes, podrías repartir por proporción de meses
              const faltasMonto = faltasDias * MONTO_FALTA_POR_DIA;
              //const gratiNeta = +Math.max(0, gratiBruta - faltasMonto).toFixed(2);
              const gratiNeta = gratiBruta - faltasMonto - noComputable;

              const bonifPct = PORCENTAJE_BONIFICACION_ESSALUD / 100;
              const bonificacion = +(gratiNeta * bonifPct).toFixed(2);

              let renta5ta = 0; // Verificar si califica renta 5ta categoria No domiciliado

              if(!trabajador.domiciliado){
                renta5ta = +(gratiNeta * (PORCENTAJE_DESCUENTO_5TA_CATEGORIA_NO_DOMICILIADO / 100)).toFixed(2);
              }

              const totalAdelantosSueldo =
                await adelantoSueldoRepository.obtenerTotalAdelantosDelTrabajadorPorRangoFecha(
                  trabajador.id,
                  fechaInicioCalculo,
                  fechaFinCalculo
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
                faltas_monto: faltasMonto,
                no_computable: noComputable,
                gratificacion_neta: gratiNeta,
                bonificacion_extraordinaria: bonificacion,
                renta_5ta: renta5ta,
                adelantos: totalAdelantosSueldo,
                total,
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
   

    console.table(listaTrabajadoresPlanilla);
    //console.table(totalesHonorarios)

    return {
      planilla: {
        trabajadores: listaTrabajadoresPlanilla,
        totales: listaTrabajadoresPlanilla.length > 0 ? totalesPlanilla : null,
      },
    
    };
  }

  async insertarCierreGratificacion(data, transaction = null) {
     const options = {};
      if (transaction) {
         options.transaction = transaction;
      }
    
    const cierreGratificacion = await CierreGratificacion.create(data, options);
    return cierreGratificacion
  }

  async insertarVariasGratificaciones(data, transaction = null) {
     const options = {};
      if (transaction) {
         options.transaction = transaction;
      }
    
    const gratificaciones = await Gratificacion.bulkCreate(data, options);
    return gratificaciones
  }

  async insertarUnaGratificacion(data, transaction = null) {
     const options = {};
      if (transaction) {
         options.transaction = transaction;
      }
    
    const gratificacion = await Gratificacion.create(data, options);
    return gratificacion
  }

  async obtenerCierreGratificacion(periodo, anio, filial_id, transaction = null) {

    let periodoBuscar;
    switch (periodo) {
      case "JULIO":
        periodoBuscar = `${anio}-07`;
        break;
      case "DICIEMBRE":
        periodoBuscar = `${anio}-12`;
        break;
    
      default:
        break;
    }
    const cierreGratificacion = await CierreGratificacion.findOne({
      where: { periodo: periodoBuscar, filial_id }, transaction
    });
 
    return cierreGratificacion;
  }

  async obtenerGratificacionPorTrabajador(periodo, anio,filial_id, trabajador_id,  transaction = null){
    let periodoBuscar;
    switch (periodo) {
      case "JULIO":
        periodoBuscar = `${anio}-07`;
        break;
      case "DICIEMBRE":
        periodoBuscar = `${anio}-12`;
        break;
    
      default:
        break;
    }
    const gratificacionPorTrabajador = await Gratificacion.findOne({
      where: { trabajador_id, periodo: periodoBuscar, filial_id }, transaction
    });
   
    return gratificacionPorTrabajador;
  }

  async actualizarCierreGratificacion(cierre_id, data, transaction = null) {
    const options = {};
    if (transaction) {
      options.transaction = transaction;
    }
    const cierreGratificacion = await CierreGratificacion.update(data, { where: { id: cierre_id } }, options);
    return cierreGratificacion;
  }
}

module.exports = SequelizeGratificacionRepository; // Exporta la clase para que pueda ser utilizada en otros módulos
