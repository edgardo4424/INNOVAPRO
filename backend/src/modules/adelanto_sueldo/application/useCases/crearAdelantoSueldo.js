const AdelantoSueldo = require("../../domain/entities/adelanto_sueldo");

module.exports = async (adelantoSueldoData, adelantoSueldoRepository) => {
   const adelanto_sueldo = new AdelantoSueldo(adelantoSueldoData);
   const errores = adelanto_sueldo.validarCamposObligatorios();
   if (errores.length > 0) {
      return { codigo: 400, respuesta: { mensaje: errores } };
   }
   const dataConstruida = adelanto_sueldo.construirDatosAdelantoSueldo();
   const nuevo_adelanto_sueldo = await adelantoSueldoRepository.crearAdelantoSueldo(
      dataConstruida
   );
   return {
      codigo: 201,
      respuesta: {
         mensaje: "Adelento de sueldo creado exitosamente",
         adelanto_sueldo: nuevo_adelanto_sueldo,
      },
   };
};
