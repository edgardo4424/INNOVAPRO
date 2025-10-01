const ReciboPorHonorario = require("../../domain/reciboPorHonorario");

module.exports = async (recibos, reciboRepository,transaction=null) => {
  
    for (const payload of recibos) {
        const recibo = new ReciboPorHonorario(payload);
          const errores = recibo.validarCamposObligatorios();
          if (errores.length > 0) {
            throw new Error("Ingrese correctamente los datos")
        }
        const construccion_datos=recibo.construirDatos();
        await reciboRepository.crearReciboPorHonorarios(construccion_datos,transaction)
    }

   const n = bono.construirDatosBono();

   return {
      codigo: 201,
      respuesta: {
         mensaje: "Recibo  creado exitosamente",
         bono: nuevoBono,
      },
   };
};
