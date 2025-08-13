module.exports = async (dataParaGenerarDespiece) => {
  
  console.log('dataParaGenerarDespiece', dataParaGenerarDespiece);
    // Los planes son por 30 dias calendario
  let tarifario_alquiler_colgante_soles = 0;

  if (dataParaGenerarDespiece.length > 0) {
    const tipoServicio =
      dataParaGenerarDespiece[0]?.atributos_formulario[0]?.tipoServicio;

      console.log('TIPO SERVICIO', tipoServicio);

    switch (tipoServicio) {
      case "BASICO":
        tarifario_alquiler_colgante_soles = 2650;
        break;
      case "INTERMEDIO":
        tarifario_alquiler_colgante_soles = 3000;
        break;
      case "INTEGRAL":
        tarifario_alquiler_colgante_soles = 5060;
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
        tarifario_alquiler_colgante_soles: tarifario_alquiler_colgante_soles,
       /*  detalles_colgantes: {
          zonas: dataParaGenerarDespiece
        } */
      },
    },
  };
};
