/**
 * Devuelve el último día de un mes dado
 */
function obtenerUltimoDiaDelMes(anio, mes) {
  return new Date(anio, mes, 0).getDate();
}

/**
 * Genera las fechas en las que se deben aplicar las cuotas de adelanto
 * @param {string} primera_cuota - Fecha de la primera cuota (YYYY-MM-DD)
 * @param {number} cuotas - Cantidad total de cuotas
 * @param {string} forma_descuento - "quincenal" o "mensual"
 * @returns {string[]} Fechas de cuotas en formato YYYY-MM-DD
 */
function obtenerFechasCuotas(primera_cuota, cuotas, forma_descuento) {
  const fechas = [];
  console.log('primera_cuota', primera_cuota);
  const [anio, mes, dia] = primera_cuota.split('-').map(Number);
  let fechaBase = new Date(anio, mes - 1, dia); // mes en base 0

  for (let i = 0; i < cuotas; i++) {
    let fecha;

    if (forma_descuento === 'quincenal') {
      if (i === 0) {
        fecha = fechaBase;
      } else {
        const ultimaFecha = new Date(fechas[fechas.length - 1]);

        if (ultimaFecha.getDate() <= 15) {
          // Si la última cuota fue antes o igual al 15 → próxima = fin de mes
          fecha = new Date(
            ultimaFecha.getFullYear(),
            ultimaFecha.getMonth(),
            obtenerUltimoDiaDelMes(
              ultimaFecha.getFullYear(),
              ultimaFecha.getMonth() + 1
            )
          );
        } else {
          // Si la última cuota fue fin de mes → próxima = 15 del mes siguiente
          fecha = new Date(
            ultimaFecha.getFullYear(),
            ultimaFecha.getMonth() + 1,
            15
          );
        }
      }
    } else if (forma_descuento === 'mensual') {
      if (i === 0) {
        fecha = fechaBase;
      } else {
        const nuevoAnio = fechaBase.getFullYear();
        const nuevoMes = fechaBase.getMonth() + i + 1;
        const nuevoDia = obtenerUltimoDiaDelMes(nuevoAnio, nuevoMes);
        fecha = new Date(nuevoAnio, nuevoMes - 1, nuevoDia);
      }
    }

    fechas.push(fecha.toISOString().split('T')[0]);
  }

  return fechas;
}

/**
 * Parsea una fecha YYYY-MM-DD y devuelve {anio, mes, dia}
 */
function parseYMD(fechaStr) {
  const [a, m, d] = fechaStr.split('-').map(Number);
  return { anio: a, mes: m, dia: d };
}

/**
 * Verifica si la fecha actual corresponde a una cuota
 * - Aplica si el pago ocurre en el mismo mes/año que la cuota,
 *   aunque sea antes del día exacto (ej. cuota 15 y pago el 14).
 * @returns {boolean}
 */
function isCuotaAplicable(primera_cuota, cuotas, fecha_anio_mes_dia, forma_descuento) {
  
  const fechasCuotas = obtenerFechasCuotas(primera_cuota, cuotas, forma_descuento);
  const { anio: anioActual, mes: mesActual } = parseYMD(fecha_anio_mes_dia);

  return fechasCuotas.some((f) => {
    const { anio, mes } = parseYMD(f);
    return anio === anioActual && mes === mesActual;
  });
}

module.exports = { isCuotaAplicable, obtenerFechasCuotas, obtenerUltimoDiaDelMes };
