const { calcularPU0100, calcularPU0400, calcularPU0600, calcularPU0700, calcularPU0800, calcularPU0900, calcularPU1000, calcularPU1100 } = require("../../../domain/formulas-generar-despieces/funcionesPuntales");

function calcularCantidadesPorCadaPiezaDePuntales(datosAtributos) {
  console.log('datosAtributos', datosAtributos);
    return datosAtributos.map((dato) => {
      const resultados = [
        { pieza: "PU.0100", cantidad: calcularPU0100(dato) },
        { pieza: "PU.0200", cantidad: calcularPU0400(dato) },
        { pieza: "PU.0300", cantidad: calcularPU0600(dato) },
        { pieza: "PU.0350", cantidad: calcularPU0700(calcularPU0100(dato), calcularPU0400(dato)) },
        { pieza: "PU.0400", cantidad: calcularPU0800(calcularPU0600(dato)) },
        { pieza: "PU.0450", cantidad: calcularPU0900(calcularPU0100(dato), calcularPU0400(dato)) },
        { pieza: "PU.0500", cantidad: calcularPU1000(calcularPU0600(dato)) },
        { pieza: "PU.0550", cantidad: calcularPU1100(dato) },
  
      ];

  
      return resultados.filter((item) => item.cantidad > 0);
    });
  }

  module.exports = {
    calcularCantidadesPorCadaPiezaDePuntales,
  };
  