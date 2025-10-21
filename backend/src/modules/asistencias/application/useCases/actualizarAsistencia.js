module.exports = async (asistenciaData, asistenciaRepository) => {
   const asistencia=await asistenciaRepository.actualizarAsistencia(asistenciaData);

   return {
      codigo: 201,
      respuesta: { mensaje: "La asistencia se actualizo exitosamente",asistencia },
   };
};
