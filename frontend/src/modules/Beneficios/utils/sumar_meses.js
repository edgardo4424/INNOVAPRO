export const sumarMeses = (fecha, cantidad) => {
   const nuevaFecha = new Date(fecha);
   nuevaFecha.setMonth(nuevaFecha.getMonth() + cantidad);
   return nuevaFecha;
};
