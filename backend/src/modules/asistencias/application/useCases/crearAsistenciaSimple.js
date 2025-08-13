module.exports = async (asistenciaData, asistenciaRepository) => {
      await asistenciaRepository.crearAsistenciaSimple(asistenciaData);

   return {
      codigo: 201,
      respuesta: { mensaje: "La asistencia Simple se guardo exitosamente" },
   };
};
