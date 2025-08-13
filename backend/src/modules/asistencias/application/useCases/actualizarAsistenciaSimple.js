module.exports = async (asistenciaData, asistenciaRepository) => {
   await asistenciaRepository.actualizarAsistenciaSimple(asistenciaData);

   return {
      codigo: 201,
      respuesta: { mensaje: "La asistencia Simple se actualizo exitosamente" },
   };
};
