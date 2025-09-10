const SequelizeAdelantoSueldoRepository = require("../../../adelanto_sueldo/infraestructure/repositories/sequlizeAdelantoSueldoRepository");
const SequelizeAsistenciaRepository = require("../../../asistencias/infraestructure/repositories/sequelizeAsistenciaRepository");
const SequelizeBonoRepository = require("../../../bonos/infraestructure/repositories/sequelizeBonoRepository");

const asistenciasRepository = new SequelizeAsistenciaRepository();
const bonosRepository = new SequelizeBonoRepository();
const adelantoSueldoRepository = new SequelizeAdelantoSueldoRepository();
const obtenerDatosPorQuincena = async (
   fecha_inicio_periodo,
   fecha_cierre_periodo,
   trabajador_id
) => {

   const responseAsistencias =
      await asistenciasRepository.obtenerAsistenciasPorRangoFecha(
         trabajador_id,
         fecha_inicio_periodo,
         fecha_cierre_periodo
      );
   const asistencias = responseAsistencias.map((a) => a.get({ plain: true }));
   let CANTIDAD_HE_PRIMERA_Q = 0;
   let CANTIDAD_HE_SEGUNDA_Q = 0;

   for (const a of asistencias) {
      if (
         a.fecha >= fecha_inicio_periodo &&
         a.fecha <= `${fecha_cierre_periodo.slice(0, -2)}15`
      ) {
         CANTIDAD_HE_PRIMERA_Q += a.horas_extras;
      }
      if (
         a.fecha > `${fecha_cierre_periodo.slice(0, -2)}15` &&
         a.fecha <= fecha_cierre_periodo
      ) {
         CANTIDAD_HE_SEGUNDA_Q += a.horas_extras;
      }
   }
   const FALTAS_PRIMERA_Q =
      await asistenciasRepository.obtenerCantidadFaltasPorRangoFecha(
         trabajador_id,
         fecha_inicio_periodo,
         `${fecha_cierre_periodo.slice(0, -2)}15`
      );
   const FALTAS_SEGUNDA_Q =
      await asistenciasRepository.obtenerCantidadFaltasPorRangoFecha(
         trabajador_id,
         `${fecha_cierre_periodo.slice(0, -2)}16`,
         fecha_cierre_periodo
      );
   const TARDANZA_PRIMERA_Q =
      await asistenciasRepository.obtenerCantidadTardanzasPorRangoFecha(
         trabajador_id,
         fecha_inicio_periodo,
         `${fecha_cierre_periodo.slice(0, -2)}15`
      );
   const TARDANZA_SEGUNDA_Q =
      await asistenciasRepository.obtenerCantidadTardanzasPorRangoFecha(
         trabajador_id,
         `${fecha_cierre_periodo.slice(0, -2)}16`,
         fecha_cierre_periodo
      );
   //Bonos deñ trabajador
   const responseBonos = await bonosRepository.obtenerBonosDelTrabajadorEnRango(
      trabajador_id,
      fecha_inicio_periodo,
      fecha_cierre_periodo
   );
   const bonos = responseBonos.map((a) => a.get({ plain: true }));
   let SUMA_BONO_PRIMERA_Q = 0;
   let SUMA_BONO_SEGUNDA_Q = 0;

   for (const b of bonos) {
      if (
         b.fecha >= fecha_inicio_periodo &&
         b.fecha <= `${fecha_cierre_periodo.slice(0, -2)}15`
      ) {
         SUMA_BONO_PRIMERA_Q += Number(b.monto);
      }
      if (
         b.fecha > `${fecha_cierre_periodo.slice(0, -2)}15` &&
         b.fecha <= fecha_cierre_periodo
      ) {
         SUMA_BONO_SEGUNDA_Q += Number(b.monto);
      }
   }
   let MONTO_ADELANTO_SUELDO = 0;
   const responseAdelantos =
      await adelantoSueldoRepository.obtenerAdelantosPorTrabajadorId(
         trabajador_id
      );
   const adelantos = responseAdelantos.map((r) => r.get({ plain: true }));
   for (const a_s of adelantos) {
      MONTO_ADELANTO_SUELDO += a_s.monto / a_s.cuotas;
   }

   return {
      CANTIDAD_HE_PRIMERA_Q,
      CANTIDAD_HE_SEGUNDA_Q,
      FALTAS_PRIMERA_Q,
      FALTAS_SEGUNDA_Q,
      TARDANZA_PRIMERA_Q,
      TARDANZA_SEGUNDA_Q,
      SUMA_BONO_PRIMERA_Q,
      SUMA_BONO_SEGUNDA_Q,
      MONTO_ADELANTO_SUELDO,
   };
};

module.exports = obtenerDatosPorQuincena;
