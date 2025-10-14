module.exports = async (data, adelantoSueldoRepository, transaction = null) => {
   const { trabajador_id, inicio, fin } = data;
   if (!trabajador_id || !inicio || !fin) {
      return {
         codigo: 400,
         respuesta: { mensaje: "Error de envio de datos" },
      };
   }
   const adelantos = await adelantoSueldoRepository.obtenerAdelantosDelTrabajadorEnRango(
      trabajador_id,
      inicio,
      fin,
      transaction
   );
   return {
      codigo: 201,
      respuesta: {
         mensaje: "Adelantos de sueldo encontrados en el rango",
         adelantos: adelantos,
      },
   };
};