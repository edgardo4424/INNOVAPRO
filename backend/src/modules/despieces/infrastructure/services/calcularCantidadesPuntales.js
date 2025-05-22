const { calcularPU0100, calcularPU0200, calcularPU0300, calcularPU0350, calcularPU0400, calcularPU0500, calcularPU0600, calcularPU0700, calcularPU0800, calcularPU0900, calcularPU1000, calcularPU1100 } = require("../../domain/formulas-generar-despieces/funcionesPuntales");

function calcularCantidadesPorCadaPiezaDePuntales(datosAtributos) {
    return datosAtributos.map((dato) => {
      const resultados = [
        { pieza: "PU.0100", cantidad: calcularPU0100(dato) },
        { pieza: "PU.0200", cantidad: calcularPU0200(dato) },
        { pieza: "PU.0300", cantidad: calcularPU0300(dato) },
        { pieza: "PU.0350", cantidad: calcularPU0350(dato) },
        { pieza: "PU.0400", cantidad: calcularPU0400(dato) },
        { pieza: "PU.0500", cantidad: calcularPU0500(dato) },
        { pieza: "PU.0600", cantidad: calcularPU0600(dato) },
        { pieza: "PU.0700", cantidad: calcularPU0700(calcularPU0100(dato), calcularPU0200(dato), calcularPU0300(dato), calcularPU0350(dato), calcularPU0400(dato), calcularPU0500(dato)) },
        { pieza: "PU.0800", cantidad: calcularPU0800(calcularPU0600(dato)) },
        { pieza: "PU.0900", cantidad: calcularPU0900(calcularPU0100(dato), calcularPU0200(dato), calcularPU0300(dato), calcularPU0350(dato), calcularPU0400(dato), calcularPU0500(dato)) },
        { pieza: "PU.1000", cantidad: calcularPU1000(calcularPU0600(dato)) },
        { pieza: "PU.1100", cantidad: calcularPU1100(dato) },
  
      ];

  
      return resultados.filter((item) => item.cantidad > 0);
    });
  }

  module.exports = {
    calcularCantidadesPorCadaPiezaDePuntales,
  };
  