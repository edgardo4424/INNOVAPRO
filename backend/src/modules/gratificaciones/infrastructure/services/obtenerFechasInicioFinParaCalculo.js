const moment = require('moment');

function obtenerFechasInicioFinParaCalculo(periodo, anio, fecha_inicio_real, fecha_fin_real) {
  
  let inicioSemestre, finSemestre;

  if (periodo === "JULIO") {
    inicioSemestre = moment(`${anio}-01-01`);
    finSemestre = moment(`${anio}-06-30`);
  } else if (periodo === "DICIEMBRE") {
    inicioSemestre = moment(`${anio}-07-01`);
    finSemestre = moment(`${anio}-12-31`);
  } else {
    throw new Error("Periodo inválido");
  }

  const fecha_inicio = moment.max(moment(fecha_inicio_real), inicioSemestre);
  const fecha_fin = fecha_fin_real
    ? moment.min(moment(fecha_fin_real), finSemestre)
    : finSemestre;

  return {
    fechaInicioCalculo: fecha_inicio.format("YYYY-MM-DD"),
    fechaFinCalculo: fecha_fin.format("YYYY-MM-DD"),
  };
}

module.exports = {obtenerFechasInicioFinParaCalculo};