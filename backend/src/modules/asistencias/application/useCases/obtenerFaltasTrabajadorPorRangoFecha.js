module.exports = async (trabajador_id,fecha_inicio,fecha_fin, asistenciaRepository) => {
   
   const faltas = await asistenciaRepository.obtenerFaltasPorRangoFecha(trabajador_id,fecha_inicio,fecha_fin);

   return {
      codigo: 200,
      respuesta: { faltas },
   };
};
