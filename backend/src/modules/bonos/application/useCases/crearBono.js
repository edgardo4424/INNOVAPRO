const Bono = require("../../domain/entities/bono");

module.exports = async (bonoData, bonoRepository) => {
   const bono = new Bono(bonoData);
   const errores = bono.validarCamposObligatorios();
   if (errores.length > 0) {
      return { codigo: 400, respuesta: { mensaje: errores } };
   }
   const nuevoBonoData = bono.construirDatosBono();
   const nuevoBono = await bonoRepository.crearBono(nuevoBonoData);
   return {
      codigo: 201,
      respuesta: {
         mensaje: "Bono creado exitosamente",
         bono: nuevoBono,
      },
   };
};
