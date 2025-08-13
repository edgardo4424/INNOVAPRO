const Bono = require("../../domain/entities/bono");

module.exports = async (bonoData, bonoRepository, transaction = null) => {
   const bono = new Bono(bonoData);
   const errores = bono.validarCamposObligatorios(true);
   if (errores.length > 0) {
      return { codigo: 400, respuesta: { mensaje: errores } };
   }
   const bonoDataActualizable = bono.construirDatosBono(true);
   await bonoRepository.editarBono(bonoDataActualizable, transaction);
   return {
      codigo: 201,
      respuesta: {
         mensaje: "Bono Actualizado exitosamente",
      },
   };
};
