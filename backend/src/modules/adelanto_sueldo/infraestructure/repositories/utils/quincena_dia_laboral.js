const obtenerUltimoDiaLaboralDeQuincena = (anio, mes, quincena = 1) => {

    const fecha = new Date(anio, mes - 1, 15);


  // Retroceder hasta que sea un día hábil (lunes a viernes: 1 a 5)
  while (fecha.getDay() === 0 || fecha.getDay() === 6) {
    fecha.setDate(fecha.getDate() - 1);
  }

  return fecha.getDate(); // Devuelve solo el número del día
};

module.exports = obtenerUltimoDiaLaboralDeQuincena;