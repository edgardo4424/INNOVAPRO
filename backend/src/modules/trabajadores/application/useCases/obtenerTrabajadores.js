module.exports = async (trabajadorRepository) => {
   //Nos traeta todos los trabajadores pero por la filial
   const trabajadores = await trabajadorRepository.obtenerTrabajadores();

   const trabajadoresConFiliales = trabajadores.map((trabajador) => {

      console.log('trabajador', trabajador);
      // ids de filiales unicos
      const filiales_ids = Array.from(new Set(trabajador.contratos_laborales?.map((filial) => filial.empresa_proveedora.id) || []));

      return {
         ...trabajador,
         filiales_ids: filiales_ids,
      }
   })

   return {
      codigo: 201,
      respuesta: {
         mensaje: "Petición exitosa",
         trabajadores: trabajadoresConFiliales,
      },
   }; // Retornamos el Trabajador creado
};
