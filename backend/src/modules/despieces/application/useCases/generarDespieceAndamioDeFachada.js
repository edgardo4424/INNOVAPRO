const {
   generarDespieceAndamioDeFachada,
} = require("../../infrastructure/services/generarDespieceAndamioFachadaService");

module.exports = async (dataParaGenerarDespice) => {
   const dataGenerarDespiceAndamioFachada = dataParaGenerarDespice.map(
      (data) => ({
         ...data,
         atributos_formulario: data.atributos_formulario.map((atributo) => ({
            ...atributo,
            longitud: Number(atributo.longitud),
            ancho: Number(atributo.ancho),
            alturaAndamio: Number(atributo.alturaAndamio),
            alturaEntrepiso: Number(atributo.alturaEntrepiso),
            tuboAmarre: Number(atributo.tuboAmarre),
         })),
      })
   );

   const despieceGenerado = await generarDespieceAndamioDeFachada(
      dataGenerarDespiceAndamioFachada
   );

   return {
      codigo: 200,
      respuesta: {
         mensaje: "Despiece del Uso ANDAMIO DE FACHADA generado exitosamente",
         despieceGenerado: "despieceGenerado",
      },
   };
};
