const ContratoLaboral = require("../../domain/entities/contratoLaboral");

module.exports = async function name(
   contratoLaboralData,
   contratoLaboralRepository,
   transaction = null
) {

   
   const contrato_laboral = new ContratoLaboral(contratoLaboralData);

   const errores = contrato_laboral.validar(true);

   console.log('errores', errores);
   if (errores.length > 0) {
      return {
         codigo: 400,
         respuesta: {
            mensaje: errores,
         },
      };
   }

   const contratoLaboralActualizado =
      await contratoLaboralRepository.editarContratoLaboral(
         contrato_laboral.get(true),
         transaction
      );


   return {
      codigo: 200,
      respuesta: {
         mensaje: "Contrato laboral actualizado exitosamnente",
         contratoLaboral: contratoLaboralActualizado,
      },
   };
};
