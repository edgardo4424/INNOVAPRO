const moment = require("moment");

function calcularDiasLaboradosQuincena(fechaIngreso, fechaFinContrato, anioMes) {
  const inicioQuincena = moment(`${anioMes}-01`);
  const finQuincena = moment(`${anioMes}-15`);

  const ingreso = moment(fechaIngreso);
  const finContrato = fechaFinContrato ? moment(fechaFinContrato) : null;

  // Si ingresó después de la quincena → 0 días
  if (ingreso.isAfter(finQuincena)) {
    return 0;
  }

  // Definir el último día que trabajó en la quincena
  const ultimaFecha = finContrato && finContrato.isBefore(finQuincena)
    ? finContrato
    : finQuincena;

  // El primer día laborado será el mayor entre el 01 y la fecha de ingreso
  const primerDia = ingreso.isAfter(inicioQuincena) ? ingreso : inicioQuincena;

  // Diferencia en días (ambos inclusive)
  const dias = ultimaFecha.diff(primerDia, 'days') + 1;
  return dias;
}

module.exports = calcularDiasLaboradosQuincena;