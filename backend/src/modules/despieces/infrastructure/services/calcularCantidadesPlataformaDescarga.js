
const { calcularEC0600, calcularEC0700, calcularEC0710, calcularEC0711, calcularEC0712, calcularEC0713, calcularEC0714, calcularEC0720, calcularEC0730, calcularEC0900 } = require("../../domain/formulas-generar-despieces/funcionesPlataformaDescarga");

function calcularCantidadesPorCadaPiezaDePlataformaDescarga(datosCantidadPlataformasDescarga) {
    return datosCantidadPlataformasDescarga.map((dato) => {
      const resultados = [
        { pieza: "EC.0600", cantidad: calcularEC0600(dato) },
        { pieza: "EC.0700", cantidad: calcularEC0700(dato) },
        { pieza: "EC.0710", cantidad: calcularEC0710({...dato, valorCalcularEC0600: calcularEC0600(dato)}) },
        { pieza: "EC.0711", cantidad: calcularEC0711({...dato, valorCalcularEC0700: calcularEC0700(dato)}) },
        { pieza: "EC.0712", cantidad: calcularEC0712({...dato, valorCalcularEC0700: calcularEC0700(dato)}) },
        { pieza: "EC.0713", cantidad: calcularEC0713(dato) },
        { pieza: "EC.0714", cantidad: calcularEC0714(dato) },
        { pieza: "EC.0720", cantidad: calcularEC0720({...dato, valorCalcularEC0700: calcularEC0700(dato)}) },
        { pieza: "EC.0730", cantidad: calcularEC0730({...dato, valorCalcularEC0700: calcularEC0700(dato)}) },
        { pieza: "EC.0900", cantidad: calcularEC0900(dato) },
      ];

      return resultados.filter((item) => item.cantidad > 0);
    });
  }

  module.exports = {
    calcularCantidadesPorCadaPiezaDePlataformaDescarga,
  };
  