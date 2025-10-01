const SequelizeAsistenciaRepository = require("../../../asistencias/infraestructure/repositories/sequelizeAsistenciaRepository");
const SequelizeVacacionesRepository = require("../../../vacaciones/infraestructure/repositories/sequelizeVacacionesRepository");

const asistenciasRepository = new SequelizeAsistenciaRepository();

const obtenerDatosAsistencia = async (
   fecha_inicio_periodo,
   fecha_cierre_periodo,
   trabajador_id
) => {
   const faltas =
      await asistenciasRepository.obtenerCantidadFaltasPorRangoFecha(
         trabajador_id,
         fecha_inicio_periodo,
         fecha_cierre_periodo
      );
   const faltas_justificadas =
      await asistenciasRepository.obtenerCantidadFaltasJustificadas(
         trabajador_id,
         fecha_inicio_periodo,
         fecha_cierre_periodo
      );
   const licencia_con_goce =
      await asistenciasRepository.obtenerCantidadLicenciaConGoce(
         trabajador_id,
         fecha_inicio_periodo,
         fecha_cierre_periodo
      );
   const licencia_sin_goce =
      await asistenciasRepository.obtenerCantidadLicenciaSinGoce(
         trabajador_id,
         fecha_inicio_periodo,
         fecha_cierre_periodo
      );
   const vacaciones_g =
      await asistenciasRepository.obtenerCantidadVacaciones(
         trabajador_id,
         fecha_inicio_periodo,
         fecha_cierre_periodo
   );
   return {
      faltas,
      faltas_justificadas,
      licencia_con_goce,
      licencia_sin_goce,
      vacaciones_g
   };
};

module.exports = obtenerDatosAsistencia;
