export const generarFechasDesdeRango = (rango) => {
  const { from, to } = rango;

  // Convertir a Date (por si vienen como string)
  const fromDate = new Date(from);
  const toDate = new Date(to);

  // Validación: fechas válidas
  if (isNaN(fromDate) || isNaN(toDate)) {
    console.warn("Fechas inválidas en el rango:", { from, to });
    return [];
  }

  // Si el rango está al revés, no hacemos nada
  if (fromDate > toDate) {
    console.warn("La fecha 'from' es mayor que 'to':", { from, to });
    return [];
  }

  const fechas = [];

  // Copiar la fecha de inicio para no mutar fromDate
  const actual = new Date(fromDate);

  // Generar fechas desde el rango
  while (actual <= toDate) {
    const fechaFormateada = actual.toISOString().split("T")[0]; // formato YYYY-MM-DD

    fechas.push({
      fecha: fechaFormateada,
      tipo: "gozada", // valor por defecto, lo puedes actualizar luego
      clicks: 1,       // lo que sea que necesites
    });

    // Avanzar al día siguiente
    actual.setDate(actual.getDate() + 1);
  }

  return fechas;
};
