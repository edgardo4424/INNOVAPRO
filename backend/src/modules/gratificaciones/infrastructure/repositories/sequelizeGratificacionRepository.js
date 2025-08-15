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


const asistenciaRepository = new SequelizeAsistenciaRepository();
const bonoRepository = new SequelizeBonoRepository()
const dataMantenimientoRepository = new SequelizeDataMantenimientoRepository();

//const MONTO_POR_HORA_EXTRA = 10;
//const MONTO_ASIGNACION_FAMILIAR = 102.5;
//const MONTO_NO_COMPUTABLE = 10;
//const MONTO_FALTA_POR_DIA = 10;

class SequelizeFilialRepository {
  async obtenerGratificaciones() {
    const usuarios = await db.usuarios.findAll();

    console.table(usuarios);

    return usuarios;
  }

  async calcularGratificaciones(periodo, anio, filial_id) {

          const MONTO_ASIGNACION_FAMILIAR = Number((await dataMantenimientoRepository.obtenerPorCodigo('valor_asignacion_familiar')).valor);
          console.log('MONTO_ASIGNACION_FAMILIAR', MONTO_ASIGNACION_FAMILIAR);

          const MONTO_FALTA_POR_DIA = Number((await dataMantenimientoRepository.obtenerPorCodigo('valor_falta')).valor);
          console.log('MONTO_FALTA_POR_DIA', MONTO_FALTA_POR_DIA);

          const MONTO_POR_HORA_EXTRA = Number((await dataMantenimientoRepository.obtenerPorCodigo('valor_hora_extra')).valor);
          console.log('MONTO_POR_HORA_EXTRA', MONTO_POR_HORA_EXTRA);

          const MONTO_NO_COMPUTABLE = Number((await dataMantenimientoRepository.obtenerPorCodigo('valor_no_computable')).valor);
          console.log('MONTO_NO_COMPUTABLE', MONTO_NO_COMPUTABLE);

          const PORCENTAJE_BONIFICACION_ESSALUD = Number((await dataMantenimientoRepository.obtenerPorCodigo('valor_bonificacion_essalud')).valor);
          console.log('PORCENTAJE_BONIFICACION_ESSALUD', PORCENTAJE_BONIFICACION_ESSALUD);

    const contratos = await db.contratos_laborales.findAll({
      include: [
        {
          model: db.trabajadores,
          as: "trabajador",
          where: {
            filial_id: filial_id,
          },
        },
      ],
      raw: false,
    });

    // Agrupar por trabajador
    const porTrabajador = new Map();
    for (const c of contratos) {
      const tid = c.trabajador_id;
      if (!porTrabajador.has(tid))
        porTrabajador.set(tid, { trabajador: c.trabajador, contratos: [] });
      porTrabajador.get(tid).contratos.push(c.get({ plain: true }));
    }

     let fechaInicio, fechaFin;

    switch (periodo) {
      case 'JULIO':      // semestre ene-jun
        fechaInicio = `${anio}-01-01`;
        fechaFin    = `${anio}-06-30`;  // <-- junio tiene 30
        break;
      case 'DICIEMBRE':  // semestre jul-dic
        fechaInicio = `${anio}-07-01`;
        fechaFin    = `${anio}-12-31`;
        break;           // <-- faltaba
    }

    const filas = await Promise.all(
      Array.from(porTrabajador.values()).map(
        async ({ trabajador, contratos }) => {
       
          // 1) Meses por régimen
          const { porRegimen, totalMeses, detalleMensual } =
            calcularMesesComputablesSemestre(contratos, periodo, anio);


          // 2) Componentes comunes de RC (si RC se calcula igual para todo el semestre)
          const asignacionFamiliar = trabajador.asignacion_familiar ? MONTO_ASIGNACION_FAMILIAR : 0;

         const totalHorasExtras = await asistenciaRepository.obtenerHorasExtrasPorRangoFecha(trabajador.id, fechaInicio, fechaFin)

          
         //console.log('totalHorasExtras', totalHorasExtras);

          const promedioHorasExtras = totalHorasExtras * MONTO_POR_HORA_EXTRA;
          const promedioBonoObra = await bonoRepository.obtenerBonoTotalDelTrabajadorPorRangoFecha(trabajador.id, fechaInicio, fechaFin); // TODO

          const noComputableDias = 0; // TODO: Falta calcular los dias no computables
          const noComputable = noComputableDias * MONTO_NO_COMPUTABLE;

           const ultimaFechaFinContrato = obtenerUltimaFechaFin(contratos);

          // Nota: si el sueldo_base cambia por contrato, ya viene por cada parte (porRegimen.sueldo_base).
          // Aquí RC se arma por parte con su sueldo_base específico:
          const partes = await Promise.all(porRegimen.map(async(p) => {

            console.log('P', p);

             const faltasDias = await asistenciaRepository.obtenerCantidadFaltasPorRangoFecha(trabajador.id, p.fecha_inicio, p.fecha_fin); // Falta calcular la cantidad de faltas
     
             console.log('faltasDias', faltasDias);
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

            const bonifPct = (PORCENTAJE_BONIFICACION_ESSALUD/100);
            const bonificacion = +(gratiNeta * bonifPct).toFixed(2);

            const renta5ta = 0,
              adelantos = 0;
            const total = +(
              gratiNeta +
              bonificacion -
              (renta5ta + adelantos)
            ).toFixed(2);

            return {
              tipo_contrato: p.tipo_contrato,
              regimen: p.regimen,
              fecha_inicio: p.fecha_inicio, // NUEVO CAMPO
              fecha_fin: ultimaFechaFinContrato,
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
              adelantos,
              total,
            };
          }));

          console.log('PARTES', partes);

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

    const listaTrabajadores = mapearParaReporteGratificaciones(filas);

    const listaTrabajadoresPlanilla = listaTrabajadores.filter(
      (trabajador) => trabajador.tipo_contrato == "PLANILLA"
    );
    const listaTrabajadoresHonorarios = listaTrabajadores.filter(
      (trabajador) => trabajador.tipo_contrato == "HONORARIO"
    );

    const totalesPlanilla = calcularResumenGratificaciones(
      listaTrabajadoresPlanilla
    );
    const totalesHonorarios = calcularResumenGratificaciones(
      listaTrabajadoresHonorarios
    );

    console.table(listaTrabajadoresPlanilla);
    //console.table(totalesHonorarios)

    return {
      planilla: {
        trabajadores: listaTrabajadoresPlanilla,
        totales: listaTrabajadoresPlanilla.length > 0 ? totalesPlanilla : null,
      },
      honorarios: {
        trabajadores: listaTrabajadoresHonorarios,
        totales:
          listaTrabajadoresHonorarios.length > 0 ? totalesHonorarios : null,
      },
    };
  }
}

module.exports = SequelizeFilialRepository; // Exporta la clase para que pueda ser utilizada en otros módulos
