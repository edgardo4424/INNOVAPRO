const atributos = {
  // Informacion general

  escuadra: Number("3"),
  tipoAnclaje: "PERNO",
  sobrecarga: Number("200"),
  factorSeguridad: Number("1.15"),

  // Escuadras con plataformas

  longTramo: Number("3072"),
  tipoPlataforma: "ESP",
  //cantEscuadrasPorTramo: Number("6"),

  //escuadras: Number("514")
};

function evaluarEscuadras({longTramo, cantEscuadrasPorTramo, valorAnteriorCantEscuadrasPorTramo}) {
  if (cantEscuadrasPorTramo === "" || cantEscuadrasPorTramo === null || cantEscuadrasPorTramo === undefined) {
    return "";
  }

  const divisor = (valorAnteriorCantEscuadrasPorTramo === "" || valorAnteriorCantEscuadrasPorTramo === null || valorAnteriorCantEscuadrasPorTramo === undefined) ? cantEscuadrasPorTramo - 1 : cantEscuadrasPorTramo;

  // Evita división por cero
  if (divisor === 0) {
    return "MAL";
  }

  const resultado = longTramo / divisor;

  return resultado < 260 ? "MAL" : resultado;
}

function evaluarFormulaCargaSolicitadaRealMedia({escuadra, sobrecarga, factorSeguridad, cantEscuadrasPorTramo, escuadras}) {
  if (cantEscuadrasPorTramo === "") {
    return "";
  }

  const valorReferencia = escuadra === 1 ? 400 : 182.5;
  const resultado = (sobrecarga * factorSeguridad * escuadras) / 1000;

  return resultado <= valorReferencia ? resultado : "MAL";
}

//const resultado = evaluarFormulaCargaSolicitadaRealMed({...atributos, escuadras: valorEscuadras})

//console.log('RESULTADO', resultado);

let resultados = []

for (let i = 1; i <= 12; i++) {
    
    const atributosParaEvaluar = {
        ...atributos,
        cantEscuadrasPorTramo: i
    }

    const valorEscuadras = evaluarEscuadras({...atributosParaEvaluar, valorAnteriorCantEscuadrasPorTramo: "7"})

    const cargaSolicitadaRealMedia = evaluarFormulaCargaSolicitadaRealMedia({...atributosParaEvaluar, escuadras: valorEscuadras})
    resultados.push({
        cantidad_escuadras_por_tramo: i,
        carga_solicitada_media: cargaSolicitadaRealMedia
    })
}

const objetivoCargaSolicitadaRealMedia = 181;

const masCercano = resultados
  .filter(r => typeof r.carga_solicitada_media === 'number')
  .reduce((prev, curr) => {
    return Math.abs(curr.carga_solicitada_media - objetivoCargaSolicitadaRealMedia) < Math.abs(prev.carga_solicitada_media - objetivoCargaSolicitadaRealMedia)
      ? curr
      : prev;
  });

const cantidad_escuadras_por_tramo = masCercano.cantidad_escuadras_por_tramo

console.log('CANTIDAD ESCUADRAS POR TRAMO', cantidad_escuadras_por_tramo);