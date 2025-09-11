/**
 * Genera las fechas en las que se deben aplicar las cuotas de adelanto
 */
function obtenerFechasCuotas(primera_cuota, cuotas, forma_descuento) {
  const fechas = [];
  const [anio, mes, dia] = primera_cuota.split("-").map(Number);

  let fechaBase = new Date(anio, mes - 1, dia); // mes en base 0

  for (let i = 0; i < cuotas ; i++) {
    let fecha;

    if (forma_descuento === "quincenal") {
      const esPrimera = i % 2 === 0;
      const incrementoMes = Math.floor(i / 2);
      const nuevoAnio = fechaBase.getFullYear();
      const nuevoMes = fechaBase.getMonth() + incrementoMes;
      const nuevoDia = esPrimera ? 15 : obtenerUltimoDiaDelMes(nuevoAnio, nuevoMes + 1); // mes + 1 porque Date espera 1-indexed para este helper

      fecha = new Date(nuevoAnio, nuevoMes, nuevoDia);
    } else if (forma_descuento === "mensual") {
      const nuevoAnio = fechaBase.getFullYear();
      const nuevoMes = fechaBase.getMonth() + i + 1;
      const nuevoDia = obtenerUltimoDiaDelMes(nuevoAnio, nuevoMes + 1);
      fecha = new Date(nuevoAnio, nuevoMes, nuevoDia);
    }

    fechas.push(fecha.toISOString().split("T")[0]);
  }

  console.log("fechas", fechas);
  return fechas;
}

function obtenerUltimoDiaDelMes(anio, mes) {
  return new Date(anio, mes, 0).getDate();
}

/**
 * Verifica si la fecha actual (fecha_anio_mes + día 15 o 30) es una de las cuotas
 */
function isCuotaAplicable(primera_cuota, cuotas, fecha_anio_mes, forma_descuento) {
  const diaEvaluacion = forma_descuento === "quincenal" ? 15 : 30;
  const fechaEvaluacion = `${fecha_anio_mes}-${diaEvaluacion.toString().padStart(2, "0")}`;
  const fechasCuotas = obtenerFechasCuotas(primera_cuota, cuotas, forma_descuento);
  return fechasCuotas.includes(fechaEvaluacion);
}

module.exports = { isCuotaAplicable };