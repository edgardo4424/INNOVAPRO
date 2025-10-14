module.exports = async (vacacionesRepository) => {
   
    const trabajadoresXvacaciones =
      await vacacionesRepository.obtenerVacacionesTrabajadores();

   return {
      codigo: 201,
      respuesta: {
         mensaje: "¡Vacaciones añadidas exitosamente!.",
         trabajadoresXvacaciones: trabajadoresXvacaciones,
      },
   };
};
