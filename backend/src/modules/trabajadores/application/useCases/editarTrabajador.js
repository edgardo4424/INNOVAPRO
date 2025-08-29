const Trabajador = require("../../domain/entities/trabajador");

module.exports = async (
   trabajadorData,
   trabajadorRepository,
   transaction = null
) => {
   console.log('enrando a ediatr trabjador');
   
   const trabajador = new Trabajador(trabajadorData);
   const errores = trabajador.validarCamposObligatorios(true);
   if (errores.length > 0) {
      return { codigo: 400, respuesta: { mensaje: errores } };
   }
   const nuevoTrabajadorData = trabajador.get(true);
   console.log('nuevoTrabajadorData: ', nuevoTrabajadorData);
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
