module.exports = async (id, trabajadorRepository) => {
   if (!id) {
      return {
         codigo: 400,
         respuesta: "Los datos enviados no son validos",
      };
   }
   const trabajador = await trabajadorRepository.obtenerTrabajadorPorId(id);
   return {
      codigo: 203,
      respuesta: {
         mensaje: "Trabajador encontrado",
         trabajador: trabajador,
      },
   };
};
