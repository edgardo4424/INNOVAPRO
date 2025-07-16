module.exports = async (dataParaGenerarDespiece) => {
  
    // Los planes son por 30 dias calendario
  let tarifario_colgante = 0;

  if (dataParaGenerarDespiece.length > 0) {
    const tipoServicio =
      dataParaGenerarDespiece[0]?.atributos_formulario[0]?.tipoServicio;

    switch (tipoServicio) {
      case "BASICO":
        tarifario_colgante = 2650;
        break;
      case "INTERMEDIO":
        tarifario_colgante = 3000;
        break;
      case "INTEGRAL":
        tarifario_colgante = 5060;
        break;

      default:
        break;
    }
  }

  return {
    codigo: 200,
    respuesta: {
      mensaje: "Despiece del Uso COLGANTE generado exitosamente",
      despieceGenerado: {
        tarifario_colgante_soles: tarifario_colgante,
       /*  detalles_colgantes: {
          zonas: dataParaGenerarDespiece
        } */
      },
    },
  };
};
