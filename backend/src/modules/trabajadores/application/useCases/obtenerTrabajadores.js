module.exports = async (trabajadorRepository) => {
   //Nos traeta todos los trabajadores pero por la filial
   const trabajadores = await trabajadorRepository.obtenerTrabajadores();

   console.log('respuesta del sequlize',trabajadores);
   
   return {
      codigo: 201,
      respuesta: {
         mensaje: "Petición exitosa",
         trabajadores: trabajadores,
      },
   }; // Retornamos el Trabajador creado
};
