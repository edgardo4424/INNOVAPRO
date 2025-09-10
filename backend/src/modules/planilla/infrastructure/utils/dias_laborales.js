const contarDiasLaborales=(fechaInicio, fechaFin)=> {
  const unDiaMs = 24 * 60 * 60 * 1000;

  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);

  if (isNaN(inicio) || isNaN(fin)) {
    throw new Error("Fechas inválidas. Usa el formato 'YYYY-MM-DD'.");
  }

  // Asegurar orden (rango inclusivo)
  let desde = inicio < fin ? inicio : fin;
  let hasta = inicio < fin ? fin : inicio;

  let contador = 0;

  while (desde <= hasta) {
    const diaSemana = desde.getUTCDay(); // 0=Domingo, 1=Lunes, ..., 6=Sábado
    if (diaSemana !== 0) { // Excluir domingos
      contador++;
    }
    desde = new Date(desde.getTime() + unDiaMs);
  }

  return contador;
}


module.exports = contarDiasLaborales;
