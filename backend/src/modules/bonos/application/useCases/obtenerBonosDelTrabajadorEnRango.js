module.exports = async (data, bonoRepository, transaction = null) => {
   const { trabajador_id, inicio, fin } = data;
   if (!trabajador_id || !inicio || !fin) {
      return {
         codigo: 400,
         respuesta: { mensaje: "Error de envio de datos" },
      };
   }
   const bonos = await bonoRepository.obtenerBonosDelTrabajadorEnRango(
      trabajador_id,
      inicio,
      fin,
      transaction
   );
   return {
      codigo: 201,
      respuesta: {
         mensaje: "Bonos encontrados en el rango",
         bonos: bonos,
      },
   };
};
