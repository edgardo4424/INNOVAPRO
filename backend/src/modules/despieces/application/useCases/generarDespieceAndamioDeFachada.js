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
            barandilla3072_2072:atributo.barandilla3072_2072=="SI"?true:false,
            barandilla732:atributo.barandilla732=="SI"?true:false,
            diagonales:atributo.diagonales=="SI"?true:false,
            plataformaAcceso:atributo.plataformaAcceso=="SI"?true:false
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
         despieceGenerado: despieceGenerado,
      },
   };
};
