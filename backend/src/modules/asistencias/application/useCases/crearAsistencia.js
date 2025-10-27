module.exports = async (asistenciaData, asistenciaRepository) => {
      const asistencia= await asistenciaRepository.crearAsistencia(asistenciaData);

   return {
      codigo: 201,
      respuesta: { mensaje: "La asistencia se guardo exitosamente",asistencia },
   };
};
