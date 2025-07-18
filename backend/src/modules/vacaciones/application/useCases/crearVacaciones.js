const Vacaciones = require("../../domain/entities/vacaciones");

module.exports = async (vacacionesData, vacacionesRepository) => {
   const vacaciones = new Vacaciones(vacacionesData);
   const errores = vacaciones.validarCampos();   
   if (errores.length > 0) {
      return { codigo: 400, respuesta: { mensaje: errores } };
   }
   const nuevasVacaciones=await vacacionesRepository.crear(vacaciones.get());

   return {
      codigo: 201,
      respuesta: {
         mensaje: "¡Vacaciones añadidas exitosamente!.",
         vacaciones: nuevasVacaciones,
      },
   };
};
