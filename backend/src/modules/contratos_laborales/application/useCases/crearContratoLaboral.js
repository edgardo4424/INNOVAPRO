const ContratoLaboral = require("../../domain/entities/contratoLaboral");

module.exports = async function name(
   contratoLaboralData,
   contratoLaboralRepository,
    transaction = null
) {
   const contrato_laboral = new ContratoLaboral(contratoLaboralData);

   const errores = contrato_laboral.validar();

   if (errores.length > 0) {
      return {
         codigo: 400,
         respuesta: {
            mensaje: errores,
         },
      };
   }
   
   console.log('contrato_laboral.get()', contrato_laboral.get());

   const nuevoContratoLaboral = await contratoLaboralRepository.crear(
      contrato_laboral.get(),
      transaction
   );
   
   return {
      codigo: 201,
      respuesta: {
         mensaje: "Contrato laboral creado exitosamente",
         contratoLaboral: nuevoContratoLaboral,
      },
   };
};
