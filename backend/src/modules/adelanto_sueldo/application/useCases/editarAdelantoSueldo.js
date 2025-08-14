const AdelantoSueldo = require("../../domain/entities/adelanto_sueldo");

module.exports = async (
   adelantoSueldoData,
   adelantoSueldoRepository,
   transaction = null
) => {
   const adelanto_sueldo = new AdelantoSueldo(adelantoSueldoData);
   const errores = adelanto_sueldo.validarCamposObligatorios(true);
   if (errores.length > 0) {
      return {
         codigo: 500,
         respuesta: {
            mensaje: errores,
         },
      };
   }
   const dataConstruida=adelanto_sueldo.construirDatosAdelantoSueldo(true);
   await adelantoSueldoRepository.editarAdelantoSueldo(dataConstruida,transaction);
   return{
    codigo:202,
    respuesta:{
        mensaje:"Adelanto de sueldo actulizado correctamente"
    }
   }
};
