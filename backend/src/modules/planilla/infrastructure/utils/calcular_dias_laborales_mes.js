const contar_dias_laborables_mes = (anio, mes_t, area) => {
  let dias_laborales_oficina = 0;
  let dias_laborales_almacen = 0;
  const mes = Number(mes_t) - 1;
  const fecha = new Date(anio, mes, 1);

  while (fecha.getMonth() === mes) {
    const dia = fecha.getDay();

    if (dia >= 1 && dia <= 5) {
      dias_laborales_oficina++;
      dias_laborales_almacen++;
    }
    if (dia === 6) {
      dias_laborales_almacen++;
    }

    fecha.setDate(fecha.getDate() + 1);
  }
  return {dias_laborales_oficina,dias_laborales_almacen};
};

module.exports = contar_dias_laborables_mes;
