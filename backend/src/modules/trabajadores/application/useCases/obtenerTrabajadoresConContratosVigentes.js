module.exports = async (filia_id, trabajadorRepository) => {
   //Nos traeta todos los trabajadores pero por la filial
   const trabajadores = await trabajadorRepository.obtenerTrabajadoresConContratosVigentes(filia_id);
   return {
      codigo: 200,
      respuesta: {
         mensaje: "Trabajadores con contratos vigentes",
         trabajadores: trabajadores,
      },
   }; // Retornamos el Trabajador creado
};
