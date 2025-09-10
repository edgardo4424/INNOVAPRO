module.exports = async (darBajaTrabajadorRepository) => {
    const trabajadores =  await darBajaTrabajadorRepository.obtenerTrabajadoresDadosDeBaja();

   return {
      codigo: 200,
      respuesta: trabajadores,
   };
};
