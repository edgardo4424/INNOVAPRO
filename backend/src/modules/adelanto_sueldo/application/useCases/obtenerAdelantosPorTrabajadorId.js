module.exports = async (id, adelantoSueldoRepository, transaction = null) => {
   if (!id) {
      return {
         codigo: 400,
         respuesta: { mensaje: "El id del trabajador no valido" },
      };
   }
   const adelantos = await adelantoSueldoRepository.obtenerAdelantosPorTrabajadorId(id, transaction);
   return {
      codigo: 200,
      respuesta: {
         mensaje: "Adelantos de sueldo encontrados por ID",
         adelantos
      },
   };
};
