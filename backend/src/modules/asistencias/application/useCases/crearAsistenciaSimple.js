module.exports = async (asistenciaData, asistenciaRepository) => {
   const asistencia=await asistenciaRepository.crearAsistenciaSimple(asistenciaData);   
   return {
      codigo: 201,
      respuesta: { mensaje: "La asistencia Simple se guardo exitosamente",asistencia},
   };
};
