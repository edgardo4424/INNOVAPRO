const SequelizeAsistenciaRepository = require("../../../asistencias/infraestructure/repositories/sequelizeAsistenciaRepository");
const SequelizeVacacionesRepository = require("../../../vacaciones/infraestructure/repositories/sequelizeVacacionesRepository");

const asistenciasRepository = new SequelizeAsistenciaRepository();
const vacacionesRepository = new SequelizeVacacionesRepository();

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
   const responseV =
      await vacacionesRepository.obtenerVacacionesPorTrabajadorId(
         fecha_inicio_periodo,
         fecha_cierre_periodo,
         trabajador_id
      );
   const vacaciones = responseV.map((v) => v.get({ plain: true }));
   return {
      faltas,
      faltas_justificadas,
      licencia_con_goce,
      licencia_sin_goce,
      vacaciones: vacaciones || [],
   };
};

module.exports = obtenerDatosAsistencia;
