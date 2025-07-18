const { calcularEV0100, calcularEV0300 } = require("../../../domain/formulas-generar-despieces/funcionesElevador");

function calcularCantidadesPorCadaPiezaDeElevador(datosAtributos) {
  
    return datosAtributos.map((dato) => {
      const resultados = [
        { pieza: "CON.0700", cantidad: calcularCON(dato) },
        { pieza: "EV.0300", cantidad: calcularEV0300(dato) },
        
      ];

      
      return resultados.filter((item) => item.cantidad > 0);
    });
  }

  module.exports = {
    calcularCantidadesPorCadaPiezaDeElevador,
  };
  