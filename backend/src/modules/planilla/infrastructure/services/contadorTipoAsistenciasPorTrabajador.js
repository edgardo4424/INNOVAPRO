const SequelizeAsistenciaRepository = require("../../../asistencias/infraestructure/repositories/sequelizeAsistenciaRepository");
const asistenciaRepository = new SequelizeAsistenciaRepository();

function convertirMinutos(minutos) {
  const horas = Math.floor(minutos / 60);
  const minutosRestantes = minutos % 60;

  return {
    horas: horas,
    minutos: minutosRestantes,
  };
}

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

  let falta = 0;
  let tardanza = 0;
  let permiso = 0;
  let licencia_con_goce = 0;
  let licencia_sin_goce = 0;
  let falta_justificada = 0;
  let vacacion_gozada = 0;

  let horas_tardanza = 0;
  let horas_permiso = 0;
  let minutos_tardanza = 0;
  let minutos_permiso = 0;
  let horas_extras=0

  for (let i = 0; i < asistencias.length; i++) {
    const estado = asistencias[i].estado_asistencia;
    if(asistencias[i].horas_extras)horas_extras++;
    if (estado === "falto") falta++;
    else if (estado === "tardanza") {
      tardanza++;
      horas_tardanza += asistencias[i].horas_trabajadas;
      minutos_tardanza += asistencias[i].minutos_trabajados;
    } else if (estado === "permiso") {
      permiso++;
      horas_permiso += asistencias[i].horas_trabajadas;
      minutos_permiso += asistencias[i].minutos_trabajados;
    } else if (estado === "licencia_con_goce") licencia_con_goce++;
    else if (estado === "licencia_sin_goce") licencia_sin_goce++;
    else if (estado === "falta-justificada") falta_justificada++;
    else if (estado === "vacacion-gozada") vacacion_gozada++;
  }
  const horas_totales = horas_tardanza + horas_permiso;
  const minutos_totales = minutos_tardanza + minutos_permiso;
  const { horas, minutos } = convertirMinutos(minutos_totales);

  const horas_sumar = horas_totales + horas;
  const minutos_sumar = minutos;
  return {
    horas_sumar,
    minutos_sumar,
    falta,
    tardanza,
    permiso,
    licencia_con_goce,
    licencia_sin_goce,
    falta_justificada,
    vacacion_gozada,
    horas_extras
  };
};

module.exports = contadorTipoAsistenciaPorTrabajador;
