const {
   generarDespieceAndamioDeFachada,
} = require("../../interfaces/controllers/despieceController");

module.exports = async (dataParaGenerarDespice) => {
   const dataGenerarDespiceAndamioFacchada = dataParaGenerarDespice.map(
      (data) => ({
         ...data,
         atributos_formulario: data.atributos_formulario.map((atributo) => ({
            ...atributo,
            longitud: Number(atributo.longitud),
         })),
      })
   );

   const despieceGenerado = await generarDespieceAndamioDeFachada(
      dataGenerarDespiceAndamioFacchada
   );

   return {
      codigo: 200,
      respuesta: {
         mensaje: "Despiece del Uso ANDAMIO DE FACHADA generado exitosamente",
         despieceGenerado: despieceGenerado,
      },
   };
};
