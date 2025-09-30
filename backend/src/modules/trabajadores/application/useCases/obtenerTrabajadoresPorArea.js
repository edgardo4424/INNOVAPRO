module.exports = async (areaId,fecha, trabajadorRepository) => {

   if(!areaId||!fecha){
      throw new Error("No se han enviado los datos correctamente")
   }
   
    //Nos traeta todos los trabajadores por el area y fecha especificada
   const response= await trabajadorRepository.obtenerTrabajadoresPorArea(areaId,fecha); 
   
   return {
      codigo: 201,
      respuesta: {
         mensaje: "Petición exitosa",
         datos: response,
      },
   }; // Retornamos los trabajadores
};
