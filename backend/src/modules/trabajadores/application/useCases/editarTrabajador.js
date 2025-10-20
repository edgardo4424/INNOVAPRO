const Trabajador = require("../../domain/entities/trabajador");

module.exports = async (
   trabajadorData,
   trabajadorRepository,
   transaction = null
) => {
   
   const trabajador = new Trabajador(trabajadorData);
   const errores = trabajador.validarCamposObligatorios(true);
 
   if (errores.length > 0) {
      return { codigo: 400, respuesta: { mensaje: errores } };
   }
   const nuevoTrabajadorData = trabajador.get(true);

   console.log('nuevoTrabajadorData', nuevoTrabajadorData);

   // Validar que no exista un numero de documento duplicado en otro trabajador
   const trabajadorExistente = await trabajadorRepository.obtenerTrabajadorPorNroDocumento(
      nuevoTrabajadorData.numero_documento,
      transaction
   );

   console.log('trabajadorExistente', trabajadorExistente);
   console.log('nuevoTrabajadorData.trabajador_id', nuevoTrabajadorData.trabajador_id);

   if(trabajadorExistente && (trabajadorExistente.id != nuevoTrabajadorData.trabajador_id)){
      return {
         codigo: 400,
         respuesta: { mensaje: "Ya existe un trabajador activo con ese número de documento." },
      };
   }


   const nuevoTrabajador = await trabajadorRepository.editar(
      nuevoTrabajadorData,
      transaction
   );
   return {
      codigo: 201,
      respuesta: {
         mensaje: "Trabajador editado exitosamente",
         trabajador: nuevoTrabajador,
      },
   };
};
