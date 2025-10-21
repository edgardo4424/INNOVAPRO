module.exports = async (asistenciaData, asistenciaRepository) => {
   const asistencia=await asistenciaRepository.actualizarAsistenciaSimple(asistenciaData);

   return {
      codigo: 201,
      respuesta: { mensaje: "La asistencia Simple se actualizo exitosamente",asistencia },
   };
};
