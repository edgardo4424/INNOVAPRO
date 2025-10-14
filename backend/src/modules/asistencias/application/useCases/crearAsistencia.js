module.exports = async (asistenciaData, asistenciaRepository) => {
      await asistenciaRepository.crearAsistencia(asistenciaData);

   return {
      codigo: 201,
      respuesta: { mensaje: "La asistencia se guardo exitosamente" },
   };
};
