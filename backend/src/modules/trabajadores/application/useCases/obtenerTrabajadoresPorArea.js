module.exports = async (areaId,fecha, trabajadorRepository) => {

    //Nos traeta todos los trabajadores por el area y fecha especificada
   const trabajadores= await trabajadorRepository.obtenerTrabajadoresPorArea(areaId,fecha); 
   
   return {
      codigo: 201,
      respuesta: {
         mensaje: "Petición exitosa",
         trabajadores: trabajadores,
      },
   }; // Retornamos los trabajadores
};
