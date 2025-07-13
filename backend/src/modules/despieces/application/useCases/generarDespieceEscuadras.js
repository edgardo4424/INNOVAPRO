const {
  generarDespieceEscuadras,
} = require("../../infrastructure/services/Escuadras/generarDespieceEscuadrasService");

function evaluarEscuadras({
  longTramo,
  cantEscuadrasPorTramo,
  valorAnteriorCantEscuadrasPorTramo,
}) {
  //console.log('valorAnterrrrrrrrrrrrrrior', valorAnteriorCantEscuadrasPorTramo);
  if (
    cantEscuadrasPorTramo === "" ||
    cantEscuadrasPorTramo === null ||
    cantEscuadrasPorTramo === undefined
  ) {
    return "";
  }

  const divisor =
    valorAnteriorCantEscuadrasPorTramo === "" ||
    valorAnteriorCantEscuadrasPorTramo === null ||
    valorAnteriorCantEscuadrasPorTramo === undefined
      ? cantEscuadrasPorTramo - 1
      : cantEscuadrasPorTramo;

  // Evita división por cero
  if (divisor === 0) {
    return "MAL";
  }

  const resultado = longTramo / divisor;

  return resultado < 260 ? "MAL" : resultado;
}

function evaluarFormulaCargaSolicitadaRealMedia({
  escuadra,
  sobrecarga,
  factorSeguridad,
  cantEscuadrasPorTramo,
  escuadras,
}) {

  if (cantEscuadrasPorTramo === "") {
    return "";
  }

  const valorReferencia = escuadra == 1 ? 400 : 182.5;
  const resultado = (sobrecarga * factorSeguridad * escuadras) / 1000;

  console.log({ valorReferencia, resultado });

  return resultado <= valorReferencia ? resultado : "MAL";
}

module.exports = async (dataParaGenerarDespiece) => {
  const dataGenerarDespieceEscuadras = dataParaGenerarDespiece.map((data) => {
    let listadoCantidadEscuadras = [];

    const atributos_formulario = data.atributos_formulario.map(
      (atributo, index) => {
        let resultados = [];

        // Obtener valor anterior si existe
        const valorAnteriorCantEscuadrasPorTramo =
          listadoCantidadEscuadras[index - 1]?.cantidadEscuadrasTramo ?? "";

        for (let i = 1; i <= 12; i++) {
          const atributosParaEvaluar = {
            ...atributo,
            cantEscuadrasPorTramo: i,
          };
          // i = 1, valorAnterior=""
          // i = 2, valorAnterior=""

          const valorEscuadras = evaluarEscuadras({
            ...atributosParaEvaluar,
            valorAnteriorCantEscuadrasPorTramo,
          });

          const cargaSolicitadaRealMedia =
            evaluarFormulaCargaSolicitadaRealMedia({
              ...atributosParaEvaluar,
              escuadras: valorEscuadras,
            });

          resultados.push({
            cantidad_escuadras_por_tramo: i,
            carga_solicitada_media: cargaSolicitadaRealMedia,
          });
        }

        const objetivo = 181;

        const validos = resultados.filter(
          (r) =>
            typeof r.carga_solicitada_media === "number" &&
            r.carga_solicitada_media <= objetivo
        );

        const masCercano =
          validos.length > 0
            ? validos.reduce((prev, curr) =>
                curr.carga_solicitada_media > prev.carga_solicitada_media
                  ? curr
                  : prev
              )
            : null;

        const cantidad = masCercano?.cantidad_escuadras_por_tramo || 0;

        listadoCantidadEscuadras.push({
          numero_escuadra: index + 1,
          cantidadEscuadrasTramo: cantidad,
        });

        console.log("listaCantidadEscuadras", listadoCantidadEscuadras);

        return {
          ...atributo,
          escuadra: Number(atributo.escuadra),
          sobrecarga: Number(atributo.sobrecarga),
          factorSeguridad: Number(atributo.factorSeguridad),
          longTramo: Number(atributo.longTramo),
          cantidadEscuadrasTramo: cantidad,
        };
      }
    );

    return {
      ...data,
      atributos_formulario,
    };
  });

  console.dir(dataGenerarDespieceEscuadras, { depth: null, colors: true });

  console.log('dataGenerarDespieceEscuadras',dataGenerarDespieceEscuadras)

  const despieceGenerado = await generarDespieceEscuadras(
    dataGenerarDespieceEscuadras
  );

  return {
    codigo: 200,
    respuesta: {
      mensaje: "Despiece del Uso ESCUADRAS generado exitosamente",
      despieceGenerado: {
        ...despieceGenerado,
        detalles_escuadras: dataGenerarDespieceEscuadras
      },
    },
  };
};
