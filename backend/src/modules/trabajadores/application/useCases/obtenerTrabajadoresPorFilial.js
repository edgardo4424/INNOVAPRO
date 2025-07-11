module.exports = async (filialId, trabajadorRepository) => {

    //Nos traeta todos los trabajadores pero por la filial
   const trabajadores= await trabajadorRepository.obtenerTrabajadoresPorFilial(filialId); 

   console.log(trabajadores);
   
   return {
      codigo: 201,
      respuesta: {
         mensaje: "Petición exitosa",
         trabajadores: trabajadores,
      },
   }; // Retornamos el Trabajador creado
};
