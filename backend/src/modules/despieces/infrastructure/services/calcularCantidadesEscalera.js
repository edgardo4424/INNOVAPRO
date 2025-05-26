const { calcularAM0100, calcularAM0300, calcularAM0400, calcularAM0600, calcularAM0700, calcularAM0900, calcularAM1000, calcularAM1100, calcularAM1150, calcularAM1300, calcularAM1400, calcularAM1500, calcularAM1600, calcularAM1800, calcularAM1900, calcularAM2000, calcularAM2020, calcularAM2050, calcularAM2100, calcularAM2200, calcularAM2250, calcularAM2300, calcularAM2400, calcularAM2500, calcularAM2600, calcularAM2700, calcularAM3100, calcularAM3200, calcularAM3300, calcularAM3400, calcularAM3500, calcularAM3600, calcularAM3700, calcularAM3800, calcularAM3900, calcularAM4000, calcularAM4100, calcularAM4200, calcularAM4300, calcularAM4400, calcularAM4500, calcularAM4600, calcularAM4700, calcularAM4800, calcularAM4900, calcularAM5000, calcularAM5100, calcularAM5200, calcularAM5300, calcularAM5400, calcularAM5500, calcularAM6000, calcularAM5600, calcularAM6100, calcularAM6200, calcularAM6300, calcularAM6400, calcularAM6500, calcularAM6600, calcularAM6700, calcularAM6800, calcularAM6900, calcularAM7000, calcularAM7100, calcularAM7200, calcularAM7300, calcularAM7400, calcularAM7410, calcularAM7420, calcularAM7430, calcularAM7440, calcularAM8100, calcularAM8200, calcularAM8300, calcularAM8400, calcularAM8500, calcularAM8600, calcularAM8700, calcularAM8800, calcularAM8900, calcularAM9000, calcularAM9100, calcularAM9200, calcularAM9300, calcularAM9400, calcularEA0100, calcularEA0200, calcularEA0400, calcularEA0300, calcularEA0500, calcularEA0600, calcularEA0700, calcularEA0800, calcularEA0900, calcularEA1000, calcularEA1100, calcularEA1200, calcularEA1300, calcularEA1400, calcularEA1500, calcularEA1600, calcularEA1650, calcularEA1700, calcularEA1750, calcularEA1800, calcularEA1850, calcularEA1900, calcularEA1950, calcularEA2000, calcularCON0100, calcularCON0200, calcularAE11400 } = require("../../domain/formulas-generar-despieces/funcionesEscalera");

function calcularCantidadesPorCadaPiezaDeEscalera(datosAtributos) {

  console.log(datosAtributos);
    return datosAtributos.map((dato) => {
      const resultados = [
        { pieza: "AM.0100", cantidad: calcularAM0100(dato) },
        { pieza: "AM.0300", cantidad: calcularAM0300(calcularAM0100(dato)) },
        { pieza: "AM.0400", cantidad: calcularAM0400() },
        { pieza: "AM.0600", cantidad: calcularAM0600() },
        { pieza: "AM.0700", cantidad: calcularAM0700(dato) },
        { pieza: "AM.0900", cantidad: calcularAM0900() },
        { pieza: "AM.1000", cantidad: calcularAM1000(dato) },
        { pieza: "AM.1100", cantidad: calcularAM1100() },
        { pieza: "AM.1150", cantidad: calcularAM1150(calcularAM0700(dato), calcularAM1000(dato), calcularAM9000(dato)) },
        { pieza: "AM.1300", cantidad: calcularAM1300(dato) },
        { pieza: "AM.1400", cantidad: calcularAM1400(dato) },
        { pieza: "AM.1500", cantidad: calcularAM1500(dato) },
        { pieza: "AM.1600", cantidad: calcularAM1600(dato) },
        { pieza: "AM.1800", cantidad: calcularAM1800(dato) },
        { pieza: "AM.1900", cantidad: calcularAM1900() },
        { pieza: "AM.2000", cantidad: calcularAM2000(dato) },
        
        { pieza: "AM.2020", cantidad: calcularAM2020() },
        { pieza: "AM.2050", cantidad: calcularAM2050() },
        { pieza: "AM.2100", cantidad: calcularAM2100() },
        { pieza: "AM.2200", cantidad: calcularAM2200(dato) },
        { pieza: "AM.2250", cantidad: calcularAM2250() },
        { pieza: "AM.2300", cantidad: calcularAM2300() },
        { pieza: "AM.2400", cantidad: calcularAM2400() },
        { pieza: "AM.2500", cantidad: calcularAM2500() },
        { pieza: "AM.2600", cantidad: calcularAM2600() },
        { pieza: "AM.2700", cantidad: calcularAM2700() },

        { pieza: "AM.3100", cantidad: calcularAM3100() },
        { pieza: "AM.3200", cantidad: calcularAM3200() },
        { pieza: "AM.3300", cantidad: calcularAM3300() },
        { pieza: "AM.3400", cantidad: calcularAM3400() },
        { pieza: "AM.3500", cantidad: calcularAM3500() },
        { pieza: "AM.3600", cantidad: calcularAM3600() },
        { pieza: "AM.3700", cantidad: calcularAM3700() },
        { pieza: "AM.3800", cantidad: calcularAM3800() },
        { pieza: "AM.3900", cantidad: calcularAM3900() },

        { pieza: "AM.4000", cantidad: calcularAM4000() },
        { pieza: "AM.4100", cantidad: calcularAM4100() },
        { pieza: "AM.4200", cantidad: calcularAM4200() },
        { pieza: "AM.4300", cantidad: calcularAM4300() },
        { pieza: "AM.4400", cantidad: calcularAM4400() },
        { pieza: "AM.4500", cantidad: calcularAM4500() },
        { pieza: "AM.4600", cantidad: calcularAM4600() },
        { pieza: "AM.4700", cantidad: calcularAM4700() },
        { pieza: "AM.4800", cantidad: calcularAM4800() },
        { pieza: "AM.4900", cantidad: calcularAM4900() },

        { pieza: "AM.5000", cantidad: calcularAM5000() },
        { pieza: "AM.5100", cantidad: calcularAM5100(dato) },
        { pieza: "AM.5200", cantidad: calcularAM5200(dato) },
        { pieza: "AM.5300", cantidad: calcularAM5300(dato) },
        { pieza: "AM.5400", cantidad: calcularAM5400(dato) },
        { pieza: "AM.5500", cantidad: calcularAM5500() },
        { pieza: "AM.5600", cantidad: calcularAM5600() },

        { pieza: "AM.6000", cantidad: calcularAM6000() },
        { pieza: "AM.6100", cantidad: calcularAM6100() },
        { pieza: "AM.6200", cantidad: calcularAM6200() },
        { pieza: "AM.6300", cantidad: calcularAM6300() },
        { pieza: "AM.6400", cantidad: calcularAM6400() },
        { pieza: "AM.6500", cantidad: calcularAM6500() },
        { pieza: "AM.6600", cantidad: calcularAM6600(dato) },
        { pieza: "AM.6700", cantidad: calcularAM6700(dato) },
        { pieza: "AM.6800", cantidad: calcularAM6800(dato) },
        { pieza: "AM.6900", cantidad: calcularAM6900(dato) },

        { pieza: "AM.7000", cantidad: calcularAM7000() },
        { pieza: "AM.7100", cantidad: calcularAM7100() },
        { pieza: "AM.7200", cantidad: calcularAM7200(dato) },
        { pieza: "AM.7300", cantidad: calcularAM7300(dato) },
        { pieza: "AM.7400", cantidad: calcularAM7400() },
        { pieza: "AM.7410", cantidad: calcularAM7410(dato) },
        { pieza: "AM.7420", cantidad: calcularAM7420() },
        { pieza: "AM.7430", cantidad: calcularAM7430() },
        { pieza: "AM.7440", cantidad: calcularAM7440() },

        { pieza: "AM.8100", cantidad: calcularAM8100() },
        { pieza: "AM.8200", cantidad: calcularAM8200() },
        { pieza: "AM.8300", cantidad: calcularAM8300() },
        { pieza: "AM.8400", cantidad: calcularAM8400() },
        { pieza: "AM.8500", cantidad: calcularAM8500(dato) },
        { pieza: "AM.8600", cantidad: calcularAM8600(dato) },
        { pieza: "AM.8700", cantidad: calcularAM8700(dato) },
        { pieza: "AM.8800", cantidad: calcularAM8800({...dato, valorCalcularAM8500: calcularAM8500(dato), valorCalcularAM8600: calcularAM8600(dato)}) },
        { pieza: "AM.8900", cantidad: calcularAM8900({...dato, valorCalcularAM8700: calcularAM8700(dato)}) },
        
        { pieza: "AM.9000", cantidad: calcularAM9000(dato) },
        { pieza: "AM.9100", cantidad: calcularAM9100() },
        { pieza: "AM.9200", cantidad: calcularAM9200(dato) },
        { pieza: "AM.9300", cantidad: calcularAM9300(dato) },
        { pieza: "AM.9400", cantidad: calcularAM9400() },
        
        { pieza: "EA.0100", cantidad: calcularEA0100(dato) },
        { pieza: "EA.0200", cantidad: calcularEA0200(calcularEA0100(dato)) },
        { pieza: "EA.0300", cantidad: calcularEA0300(calcularEA0100(dato)) },
        { pieza: "EA.0400", cantidad: calcularEA0400(dato) },
        { pieza: "EA.0500", cantidad: calcularEA0500(calcularEA0400(dato)) },
        { pieza: "EA.0600", cantidad: calcularEA0600(dato) },
        { pieza: "EA.0700", cantidad: calcularEA0700(dato) },
        { pieza: "EA.0800", cantidad: calcularEA0800(calcularEA0600(dato)) },
        { pieza: "EA.0900", cantidad: calcularEA0900(calcularEA0700(dato)) },

        { pieza: "EA.1000", cantidad: calcularEA1000() },
        { pieza: "EA.1100", cantidad: calcularEA1100(dato) },
        { pieza: "EA.1200", cantidad: calcularEA1200() },
        { pieza: "EA.1300", cantidad: calcularEA1300(dato) },
        { pieza: "EA.1400", cantidad: calcularEA1400(dato) },
        { pieza: "EA.1500", cantidad: calcularEA1500(calcularEA1400(dato)) },
        { pieza: "EA.1600", cantidad: calcularEA1600(dato) },
        { pieza: "EA.1650", cantidad: calcularEA1650() },
        { pieza: "EA.1700", cantidad: calcularEA1700(dato) },
        { pieza: "EA.1750", cantidad: calcularEA1750() },
        { pieza: "EA.1800", cantidad: calcularEA1800(dato) },
        { pieza: "EA.1850", cantidad: calcularEA1850() },
        { pieza: "EA.1900", cantidad: calcularEA1900(dato) },
        { pieza: "EA.1950", cantidad: calcularEA1950() },

        { pieza: "EA.2000", cantidad: calcularEA2000(calcularEA1500(dato), calcularAM1900(dato)) },
        { pieza: "CON.0100", cantidad: calcularCON0100(calcularAM8500(dato), calcularAM8600(dato)) },
        { pieza: "CON.0200", cantidad: calcularCON0200(calcularAM8700(dato), calcularAM8600(dato)) },

        { pieza: "AE.11400", cantidad: calcularAE11400(dato) },

      ];

  
      return resultados.filter((item) => item.cantidad > 0);
    });
  }

  module.exports = {
    calcularCantidadesPorCadaPiezaDeEscalera,
  };
  