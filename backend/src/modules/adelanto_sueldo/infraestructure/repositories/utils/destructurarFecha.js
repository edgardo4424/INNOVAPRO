const destruturarFecha = (fecha_recibida) => {
   if (!fecha_recibida) return null;
   const anio = fecha_recibida.slice(0, -6);
   const mes = fecha_recibida.slice(5, -3);
   const dia = fecha_recibida.slice(-2);
   return {
      anio,
      mes,
      dia,
   };
};

module.exports = destruturarFecha;
