const { parseISO, format } =require( "date-fns");

const formatearFecha = (fechaISO) => {
  if (!fechaISO) return "";

  const fecha = parseISO(fechaISO);
  return format(fecha, "dd-MM-yyyy");
};
module.exports = formatearFecha;
