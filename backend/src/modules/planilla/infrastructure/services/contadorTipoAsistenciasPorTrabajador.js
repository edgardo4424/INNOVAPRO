const SequelizeAsistenciaRepository = require("../../../asistencias/infraestructure/repositories/sequelizeAsistenciaRepository");
const asistenciaRepository = new SequelizeAsistenciaRepository();
const contadorTipoAsistenciaPorTrabajador = async (
  trabajador_id,
  inicio,
  fin
) => {
  const asistencias =
    await asistenciaRepository.obtenerAsistenciasPorRangoFecha(
      trabajador_id,
      inicio,
      fin
    );

  let falto = 0;
  let tardanza = 0;
  let permiso = 0;
  let licencia_con_goce = 0;
  let licencia_sin_goce = 0;
  let falta_justificada = 0;
  let vacacion_gozada = 0;
  let vacacion_vendida = 0;
  let horas_tardanza=0;
  let horas_permiso=0;
  let minutos_tardanza=0;
  let minutos_permiso=0;

  for (let i = 0; i < asistencias.length; i++) {
    const estado = asistencias[i].estado_asistencia;
     if (estado === "falto") falto++;
    else if (estado === "tardanza"){
        tardanza++
    }
    else if (estado === "permiso"){
        permiso++
    }
    else if (estado === "licencia_con_goce") licencia_con_goce++;
    else if (estado === "licencia_sin_goce") licencia_sin_goce++;
    else if (estado === "falta-justificada") falta_justificada++;
    else if (estado === "vacacion-gozada") vacacion_gozada++;
    else if (estado === "vacacion-vendida") vacacion_vendida++;
  }
};

module.exports = contadorTipoAsistenciaPorTrabajador;
