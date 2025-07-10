const {
  generarDespieceEscuadras,
} = require("../../infrastructure/services/Escuadras/generarDespieceEscuadrasService");

function evaluarEscuadras({
  longTramo,
  cantEscuadrasPorTramo,
  valorAnteriorCantEscuadrasPorTramo,
}) {
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

  const valorReferencia = escuadra === 1 ? 400 : 182.5;
  const resultado = (sobrecarga * factorSeguridad * escuadras) / 1000;

  return resultado <= valorReferencia ? resultado : "MAL";
}


module.exports = async (dataParaGenerarDespiece) => {
  let listadoCantidadEscuadras = [];

  const dataGenerarDespieceEscuadras = dataParaGenerarDespiece.map(
    (data, index) => {

     

      const atributos_formulario = data.atributos_formulario.map((atributo) => {
        let resultados = [];

         
      // Obtener valor anterior si existe
      const valorAnteriorCantEscuadrasPorTramo =
        listadoCantidadEscuadras[index]?.cantidadEscuadrasTramo ?? "";

      console.log('listadoCantidadEscuadras', listadoCantidadEscuadras);
      

        for (let i = 1; i <= 12; i++) {
          const atributosParaEvaluar = {
            ...atributo,
            cantEscuadrasPorTramo: i,
          };

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
        const validos = resultados.filter((r) => typeof r.carga_solicitada_media === "number");

        const masCercano = validos.reduce((prev, curr) =>
          Math.abs(curr.carga_solicitada_media - objetivo) <
          Math.abs(prev.carga_solicitada_media - objetivo)
            ? curr
            : prev
        );

        const cantidad = masCercano?.cantidad_escuadras_por_tramo || 0;

        console.log('cantidad', cantidad);

        listadoCantidadEscuadras.push({
          numero_escuadra: index + 1,
          cantidadEscuadrasTramo: cantidad,
        });

        return {
          ...atributo,
          escuadra: Number(atributo.escuadra),
          sobrecarga: Number(atributo.sobrecarga),
          factorSeguridad: Number(atributo.factorSeguridad),
          longTramo: Number(atributo.longTramo),
          cantidadEscuadrasTramo: cantidad,
        };
      });

      return {
        ...data,
        atributos_formulario,
      };
    }
  );

  return {
    codigo: 200,
    respuesta: {
      mensaje: "Despiece del Uso ESCUADRAS generado exitosamente",
      despieceGenerado: dataGenerarDespieceEscuadras,
    },
  };
};
