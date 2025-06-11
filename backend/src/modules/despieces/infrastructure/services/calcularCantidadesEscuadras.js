
const { calcularCON0200 } = require("../../domain/formulas-generar-despieces/funcionesEscalera");
const { calcularAM6000, calcularAM6100, calcularAM6200, calcularAM6300, calcularAM6400, calcularAM6500, calcularAM6600, calcularAM6700, calcularAM6800, calcularAM6900, calcularAM7000, calcularAM7100, calcularAM7200, calcularAM7300, calcularAM7400, calcularAM7410, calcularAM7420, calcularAM7430, calcularAM7440, calcularEC0100, calcularEC0300, calcularEC0800, calcularCON0300, calcularEN0310, calcularEN0400 } = require("../../domain/formulas-generar-despieces/funcionesEscuadras");

function calcularCantidadesPorCadaPiezaDeEscuadras(datosCantidadPlataformasDescarga) {
    return datosCantidadPlataformasDescarga.map((dato) => {
      const resultados = [
        { pieza: "AM.6000", cantidad: calcularAM6000(dato) },
        { pieza: "AM.6100", cantidad: calcularAM6100(dato) },
        { pieza: "AM.6200", cantidad: calcularAM6200(dato) },
        { pieza: "AM.6300", cantidad: calcularAM6300(dato) },
        { pieza: "AM.6400", cantidad: calcularAM6400(dato) },
        { pieza: "AM.6500", cantidad: calcularAM6500(dato) },
        { pieza: "AM.6600", cantidad: calcularAM6600(dato) },
        { pieza: "AM.6700", cantidad: calcularAM6700(dato) },
        { pieza: "AM.6800", cantidad: calcularAM6800(dato) },
        { pieza: "AM.6900", cantidad: calcularAM6900(dato) },
        { pieza: "AM.7000", cantidad: calcularAM7000(dato) },
        { pieza: "AM.7100", cantidad: calcularAM7100(dato) },
        { pieza: "AM.7200", cantidad: calcularAM7200(dato) },
        { pieza: "AM.7300", cantidad: calcularAM7300(dato) },
        { pieza: "AM.7400", cantidad: calcularAM7400(dato) },
        { pieza: "AM.7410", cantidad: calcularAM7410(dato) },
        { pieza: "AM.7420", cantidad: calcularAM7420(dato) },
        { pieza: "AM.7430", cantidad: calcularAM7430(dato) },
        { pieza: "AM.7440", cantidad: calcularAM7440(dato) },
        { pieza: "EC.0100", cantidad: calcularEC0100(dato) },
        { pieza: "EC.0300", cantidad: calcularEC0300(dato) },
        { pieza: "EC.0800", cantidad: calcularEC0800(dato) },
        { pieza: "CON.0200", cantidad: calcularCON0200(dato) },
        { pieza: "CON.0300", cantidad: calcularCON0300(calcularEC0800(dato)) },
        { pieza: "EN.0310", cantidad: calcularEN0310(dato) },
        { pieza: "EN.0400", cantidad: calcularEN0400(calcularEN0310(dato)) },
      ];

      return resultados.filter((item) => item.cantidad > 0);
    });
  }

  module.exports = {
    calcularCantidadesPorCadaPiezaDeEscuadras,
  };
  