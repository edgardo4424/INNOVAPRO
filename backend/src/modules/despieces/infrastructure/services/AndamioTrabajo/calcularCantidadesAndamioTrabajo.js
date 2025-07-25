const {
  calcularAcopladorMulti,
  calcularBarandillaCombi0732,
  calcularBarandillaCombi2072,
  calcularBarandillaCombi3072,
  calcularBridaFija,
  calcularBridaGiratoria,
  calcularConectorSuspension,
  calcularDiagonal1020,
  calcularDiagonal1090,
  calcularDiagonal1572,
  calcularDiagonal2072,
  calcularDiagonal2572,
  calcularDiagonal3072,
  calcularEspiga,
  calcularGarruchaConFreno,
  calcularHorizontalMulti0432MensulaE,
  calcularHorizontalMulti0432MensulaN,
  calcularHorizontalMulti0732,
  calcularHorizontalMulti1020,
  calcularHorizontalMulti1090,
  calcularHorizontalMulti1572,
  calcularHorizontalMulti2072,
  calcularHorizontalMulti2572,
  calcularHorizontalMulti3072,
  calcularHusilloDeNivelacion,
  calcularMensula1090,
  calcularMensula300,
  calcularMensula700,
  calcularPernosExpansion,
  calcularPernosExpansionArgolla,
  calcularPiezaInicio,
  calcularPinGravedad12mm,
  calcularPinGravedad9mm,
  calcularPlataformaAluminioAcceso1572,
  calcularPlataformaAluminioAcceso2072,
  calcularPlataformaAluminioAcceso2572,
  calcularPlataformaAluminioAcceso3072,
  calcularPlataformaMetalica190x0732C,
  calcularPlataformaMetalica190x1020C,
  calcularPlataformaMetalica190x1090C,
  calcularPlataformaMetalica190x1572C,
  calcularPlataformaMetalica190x2072C,
  calcularPlataformaMetalica190x2572C,
  calcularPlataformaMetalica190x3072C,
  calcularPlataformaMetalica290x0732E,
  calcularPlataformaMetalica290x1020E,
  calcularPlataformaMetalica290x1572E,
  calcularPlataformaMetalica290x2072E,
  calcularPlataformaMetalica290x2572E,
  calcularPlataformaMetalica290x3072E,
  calcularPlataformaMetalica320x0732C,
  calcularPlataformaMetalica320x1090C,
  calcularPlataformaMetalica320x1572C,
  calcularPlataformaMetalica320x2072C,
  calcularPlataformaMetalica320x2572C,
  calcularPlataformaMetalica320x3072C,
  calcularPlataformaMixtaAcceso2572,
  calcularPlataformaMixtaAcceso3072,
  calcularRodapie0732C,
  calcularRodapie0732E,
  calcularRodapie0732N,
  calcularRodapie1020E,
  calcularRodapie1090C,
  calcularRodapie1090N,
  calcularRodapie1572C,
  calcularRodapie1572N,
  calcularRodapie2072C,
  calcularRodapie2072E,
  calcularRodapie2072N,
  calcularRodapie2572C,
  calcularRodapie2572E,
  calcularRodapie2572N,
  calcularRodapie3072C,
  calcularRodapie3072E,
  calcularRodapie3072N,
  calcularTuboGancho050,
  calcularTuboGancho100,
  calcularVertical050,
  calcularVertical100,
  calcularVertical150,
  calcularVertical200,
  calcularVertical300,
} = require("../../../domain/formulas-generar-despieces/funcionesAndamioTrabajo");

function calcularCantidadesPorCadaPiezaDeAndamioTrabajo(datosConCantidadAndamios) {
    return datosConCantidadAndamios.map((dato) => {
      const resultados = [
        { pieza: "AM.0100", cantidad: calcularHusilloDeNivelacion(dato) },
        { pieza: "AM.0200", cantidad: calcularGarruchaConFreno(dato) },
        {
          pieza: "AM.0300",
          cantidad: calcularPiezaInicio(
            calcularHusilloDeNivelacion(dato),
            calcularGarruchaConFreno(dato)
          ),
        },
        { pieza: "AM.0600", cantidad: calcularVertical300(dato) },
        { pieza: "AM.0700", cantidad: calcularVertical200(dato) },
        { pieza: "AM.0900", cantidad: calcularVertical150(dato) },
        { pieza: "AM.1000", cantidad: calcularVertical100(dato) },
        { pieza: "AM.1100", cantidad: calcularVertical050(dato) },
        {
          pieza: "AM.1150",
          cantidad: calcularEspiga(
            calcularVertical200(dato),
            calcularVertical150(dato),
            calcularVertical100(dato),
            calcularVertical050(dato),
            calcularMensula1090(dato),
            calcularMensula700(dato),
            calcularMensula300(dato),
            calcularAcopladorMulti(dato)
          ),
        },
        { pieza: "AM.1300", cantidad: calcularHorizontalMulti3072(dato) },
        { pieza: "AM.1400", cantidad: calcularHorizontalMulti2572(dato) },
        { pieza: "AM.1500", cantidad: calcularHorizontalMulti2072(dato) },
        { pieza: "AM.1600", cantidad: calcularHorizontalMulti1572(dato) },
        { pieza: "AM.1800", cantidad: calcularHorizontalMulti1090(dato) },
        { pieza: "AM.1900", cantidad: calcularHorizontalMulti1020(dato) },
        { pieza: "AM.2000", cantidad: calcularHorizontalMulti0732(dato) },
        { pieza: "AM.2020", cantidad: calcularHorizontalMulti0432MensulaN(dato) },
        { pieza: "AM.2050", cantidad: calcularHorizontalMulti0432MensulaE(dato) },
  
        { pieza: "AM.2800", cantidad: calcularBarandillaCombi3072(dato) },
        { pieza: "AM.2900", cantidad: calcularBarandillaCombi2072(dato) },
        { pieza: "AM.3000", cantidad: calcularBarandillaCombi0732(dato) },
        { pieza: "AM.3100", cantidad: calcularMensula1090(dato) },
        { pieza: "AM.3200", cantidad: calcularMensula700(dato) },
        { pieza: "AM.3300", cantidad: calcularMensula300(dato) },
  
        { pieza: "AM.3400", cantidad: calcularRodapie3072E(dato) },
        { pieza: "AM.3500", cantidad: calcularRodapie2572E(dato) },
        { pieza: "AM.3600", cantidad: calcularRodapie2072E(dato) },
        { pieza: "AM.3700", cantidad: calcularRodapie1020E(dato) },
        { pieza: "AM.3800", cantidad: calcularRodapie0732E(dato) },
        { pieza: "AM.3900", cantidad: calcularRodapie3072C(dato) },
        { pieza: "AM.4000", cantidad: calcularRodapie2572C(dato) },
        { pieza: "AM.4100", cantidad: calcularRodapie2072C(dato) },
        { pieza: "AM.4200", cantidad: calcularRodapie1572C(dato) },
        { pieza: "AM.4300", cantidad: calcularRodapie1090C(dato) },
        { pieza: "AM.4400", cantidad: calcularRodapie0732C(dato) },
        { pieza: "AM.4500", cantidad: calcularRodapie3072N(dato) },
        { pieza: "AM.4600", cantidad: calcularRodapie2572N(dato) },
        { pieza: "AM.4700", cantidad: calcularRodapie2072N(dato) },
        { pieza: "AM.4800", cantidad: calcularRodapie1572N(dato) },
        { pieza: "AM.4900", cantidad: calcularRodapie1090N(dato) },
        { pieza: "AM.5000", cantidad: calcularRodapie0732N(dato) },
  
        { pieza: "AM.5100", cantidad: calcularDiagonal3072(dato) },
        { pieza: "AM.5200", cantidad: calcularDiagonal2572(dato) },
        { pieza: "AM.5300", cantidad: calcularDiagonal2072(dato) },
        { pieza: "AM.5400", cantidad: calcularDiagonal1572(dato) },
        { pieza: "AM.5500", cantidad: calcularDiagonal1090(dato) },
        { pieza: "AM.5600", cantidad: calcularDiagonal1020(dato) },
  
        { pieza: "AM.6000", cantidad: calcularPlataformaMetalica290x3072E(dato) },
        { pieza: "AM.6100", cantidad: calcularPlataformaMetalica290x2572E(dato) },
        { pieza: "AM.6200", cantidad: calcularPlataformaMetalica290x2072E(dato) },
        { pieza: "AM.6300", cantidad: calcularPlataformaMetalica290x1572E(dato) },
        { pieza: "AM.6400", cantidad: calcularPlataformaMetalica290x1020E(dato) },
        { pieza: "AM.6500", cantidad: calcularPlataformaMetalica290x0732E(dato) },
        { pieza: "AM.6600", cantidad: calcularPlataformaMetalica320x3072C(dato) },
        { pieza: "AM.6700", cantidad: calcularPlataformaMetalica320x2572C(dato) },
        { pieza: "AM.6800", cantidad: calcularPlataformaMetalica320x2072C(dato) },
        { pieza: "AM.6900", cantidad: calcularPlataformaMetalica320x1572C(dato) },
        { pieza: "AM.7000", cantidad: calcularPlataformaMetalica320x1090C(dato) },
        { pieza: "AM.7100", cantidad: calcularPlataformaMetalica320x0732C(dato) },
        { pieza: "AM.7200", cantidad: calcularPlataformaMetalica190x3072C(dato) },
        { pieza: "AM.7300", cantidad: calcularPlataformaMetalica190x2572C(dato) },
        { pieza: "AM.7400", cantidad: calcularPlataformaMetalica190x2072C(dato) },
        { pieza: "AM.7410", cantidad: calcularPlataformaMetalica190x1572C(dato) },
        { pieza: "AM.7420", cantidad: calcularPlataformaMetalica190x1090C(dato) },
        { pieza: "AM.7430", cantidad: calcularPlataformaMetalica190x1020C(dato) },
        { pieza: "AM.7440", cantidad: calcularPlataformaMetalica190x0732C(dato) },
  
        {
          pieza: "AM.7450",
          cantidad: calcularPlataformaAluminioAcceso3072(dato),
        },
        {
          pieza: "AM.7451",
          cantidad: calcularPlataformaAluminioAcceso2572(dato),
        },
        {
          pieza: "AM.7452",
          cantidad: calcularPlataformaAluminioAcceso2072(dato),
        },
        {
          pieza: "AM.7453",
          cantidad: calcularPlataformaAluminioAcceso1572(dato),
        },
        { pieza: "AM.7900", cantidad: calcularPlataformaMixtaAcceso3072(dato) },
        { pieza: "AM.8000", cantidad: calcularPlataformaMixtaAcceso2572(dato) },
  
        { pieza: "AM.8500", cantidad: calcularTuboGancho100(dato) },
        { pieza: "AM.8600", cantidad: calcularTuboGancho050(dato) },
        {
          pieza: "AM.8800",
          cantidad: calcularBridaGiratoria(
            calcularTuboGancho100(dato),
            calcularTuboGancho050(dato)
          ),
        },
        { pieza: "AM.8900", cantidad: calcularBridaFija(dato) },
        { pieza: "AM.9000", cantidad: calcularAcopladorMulti(dato) },
        { pieza: "AM.9100", cantidad: calcularConectorSuspension(dato) },
  
        { pieza: "AM.9200", cantidad: calcularPinGravedad12mm(dato) },
        { pieza: "AM.9300", cantidad: calcularPinGravedad9mm(dato) },
        {
          pieza: "CON.0100",
          cantidad: calcularPernosExpansionArgolla(
            dato.cantidadAndamios,
            calcularTuboGancho100(dato),
            calcularTuboGancho050(dato)
          ),
        },
        { pieza: "CON.0200", cantidad: calcularPernosExpansion(dato) },
  
      ];
  
      return resultados.filter((item) => item.cantidad > 0);
    });
  }

  module.exports = {
    calcularCantidadesPorCadaPiezaDeAndamioTrabajo,
  };
  