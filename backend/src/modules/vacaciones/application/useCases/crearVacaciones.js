const Vacaciones = require("../../domain/entities/vacaciones");
const {
   obtenerImporteDiasVendidos,
} = require("../../infraestructure/services/contratoLaboralActual");

module.exports = async (vacacionesData, vacacionesRepository) => {
   const vacaciones = new Vacaciones(vacacionesData);
   console.log(vacacionesData);

   const errores = vacaciones.validarCampos();
   console.log("errores recibidos", errores);

   if (errores.length > 0) {
      return { codigo: 400, respuesta: { mensaje: errores } };
   }
   const dataVacaciones = vacaciones.get();
   const importe_dias_vendidos = await obtenerImporteDiasVendidos(
      dataVacaciones.contratos_laborales,
      dataVacaciones.asignacion_familiar,
      dataVacaciones.dias_vendidos
   );
   // console.log('datos de las vacaciones',dataVacaciones);
   
   const nuevasVacaciones = await vacacionesRepository.crear(
      dataVacaciones,
      importe_dias_vendidos
   );

   return {
      codigo: 201,
      respuesta: {
         mensaje: "¡Vacaciones añadidas exitosamente!.",
         vacaciones: nuevasVacaciones,
      },
   };
};
