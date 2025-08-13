export function contarDiasLaborables(inicio, fin) {
  let contador = 0;
  const actual = new Date(inicio);
  while (actual <= fin) {
    const dia = actual.getDay();
    if (dia !== 0 && dia !== 6) contador++;
    actual.setDate(actual.getDate() + 1);
  }
  return contador;
}

export function contarDiasLaborablesDelMes(anio, mes) {
  let contador = 0;
  const fecha = new Date(anio, mes, 1);
  while (fecha.getMonth() === mes) {
    const dia = fecha.getDay();
    if (dia !== 0 && dia !== 6) contador++;
    fecha.setDate(fecha.getDate() + 1);
  }
  return contador;
}

export function sumarMeses(fecha, cantidad) {
  const nuevaFecha = new Date(fecha);
  nuevaFecha.setMonth(nuevaFecha.getMonth() + cantidad);
  return nuevaFecha;
}
