const {
   calcularHusilloNivelacion,
   calcularPiezaInicio,
   calcularPerfilMetalicoUPN,
   calcularMarcoCombi200,
   calcularVertical050,
   calcularVertical200,
   calcularVertical100,
   calcularVertical150,
   calcularEspiga,
   calcularHorizontalMulti0732,
   calcularHorizontalMulti3072,
   calcularHorizontalMulti1020,
   calcularHorizontalMulti2572,
   calcularHorizontalMulti2072,
   calcularHorizontalMulti1572,
   calcularHorizontalMulti1090,
   calcularBarandillasCombi3072,
   calcularBarandillasCombi2072,
   calcularBarandillasCombi0732,
   calcularRodapie3072E,
   calcularRodapie2572E,
   calcularRodapie2072E,
   calcularRodapie1020E,
   calcularRodapie0732E,
   calcularRodapie3072C,
   calcularRodapie2572C,
   calcularRodapie2072C,
   calcularRodapie1572C,
   calcularRodapie1090C,
   calcularRodapie0732C,
   calcularRodapie3072N,
   calcularRodapie2572N,
   calcularRodapie2072N,
   calcularRodapie1572N,
   calcularRodapie1090N,
   calcularRodapie0732N,
   calcularDiagonal3072,
   calcularDiagonal2572,
   calcularDiagonal2072,
   calcularDiagonal1572,
   calcularDiagonal1090,
   calcularDiagonal1020,
   calcularPlataforma3072E,
   calcularPlataforma2572E,
   calcularPlataforma2072E,
   calcularPlataforma290x1572E,
   calcularPlataforma290x1020E,
   calcularPlataforma290x0732E,
   calcularPlataforma320x3072C,
   calcularPlataforma320x2572C,
   calcularPlataforma320x2072C,
   calcularPlataforma320x1572C,
   calcularPlataforma320x1090C,
   calcularPlataforma320x0732C,
   calcularPlataforma190x3072C,
   calcularPlataforma190x2572C,
   calcularPlataforma190x2072C,
   calcularPlataformaAM7410,
   calcularPlataforma190x1090C,
   calcularPlataforma190x1020C,
   calcularPlataforma190x0732C,
   calcularPlataformaAcceso3072,
   calcularPlataformaAcceso2572,
   calcularPlataformaAcceso2072,
   calcularPlataformaAcceso1572,
   calcularTuboGancho1m,
   calcularTuboGancho05m,
   calcularBridaGiratoria,
   calcularPernosExpansionM12x80,
   calcularPuntal3m,
   calcularPinPresion11mm,
   calcularArgolla4840mm,
} = require("../../../domain/formulas-generar-despieces/funcionesAndamioFachada");

function calcularCantidadesPorCadaPiezaDeAndamioFachada(datosAtributos) {
   return datosAtributos.map((dato) => {
      const valorHusilloNivelacion = calcularHusilloNivelacion(dato);
      const valorPerfilMetalicoUPN = calcularPerfilMetalicoUPN(dato);
      const valorPiezaInicio = calcularPiezaInicio(
         valorHusilloNivelacion,
         valorPerfilMetalicoUPN
      );
      const valorMarcoCombi200 = calcularMarcoCombi200(dato, valorPiezaInicio);
      const vertical150 = dato.vertical150 ? dato.vertical150 : 0;
      const vertical050 = dato.vertical050 ? dato.vertical050 : 0;
      const mensula1090 = dato.mensula1090 ? dato.mensula1090 : 0;
      const mensula700 = dato.mensula700 ? dato.mensula700 : 0;
      const mensula300 = dato.mensula300 ? dato.mensula300 : 0;
      const acopladorMulti = dato.acopladorMulti ? dato.acopladorMulti : 0;
      const valorBarandillasCombi0732 = calcularBarandillasCombi0732(dato);
      const valorPlataformaAcceso3072 = calcularPlataformaAcceso3072(dato);
      const valorPlataformaAcceso2572 = calcularPlataformaAcceso2572(dato);
      const valorPlataformaAcceso2072 = calcularPlataformaAcceso2072(dato);
      const valorPlataformaAcceso1572 = calcularPlataformaAcceso1572(dato);
      const valorTuboGancho1m = calcularTuboGancho1m(dato);
      const valorTuboGancho05m = calcularTuboGancho05m(dato);
      const valorPuntal3mAzul = calcularPuntal3m(dato,valorPerfilMetalicoUPN);

      const resultados = [
         {
            pieza: "AM.0100",
            cantidad: valorHusilloNivelacion,
         },
         {
            pieza: "AM.0300",
            cantidad: valorPiezaInicio,
         },
         {
            pieza: "AM.0400",
            cantidad: valorPerfilMetalicoUPN,
         },
         {
            pieza: "AM.0500",
            cantidad: valorMarcoCombi200,
         },
         {
            pieza: "AM.0700",
            cantidad: calcularVertical200(dato),
         },
         {
            pieza: "AM.1000",
            cantidad: calcularVertical100(dato),
         },
         {
            pieza: "AM.1150",
            cantidad: calcularEspiga(
               valorMarcoCombi200, //f24
               calcularVertical200(dato), //f25
               vertical150, //f26
               calcularVertical100(dato), //f27
               vertical050, //f28
               mensula1090, //f42
               mensula700, //f43
               mensula300, //f44
               acopladorMulti //f97
            ),
         },
         {
            pieza: "AM.1300",
            cantidad: calcularHorizontalMulti3072(dato),
         },
         {
            pieza: "AM.1400",
            cantidad: calcularHorizontalMulti2572(dato),
         },
         {
            pieza: "AM.1500",
            cantidad: calcularHorizontalMulti2072(dato),
         },
         {
            pieza: "AM.1600",
            cantidad: calcularHorizontalMulti1572(dato),
         },
         {
            pieza: "AM.1800",
            cantidad: calcularHorizontalMulti1090(dato),
         },
         {
            pieza: "AM.1900",
            cantidad: calcularHorizontalMulti1020(dato),
         },
         {
            pieza: "AM.2000",
            cantidad: calcularHorizontalMulti0732(
               dato,
               valorBarandillasCombi0732
            ),
         },
         {
            pieza: "AM.2800",
            cantidad: calcularBarandillasCombi3072(dato),
         },
         {
            pieza: "AM.2900",
            cantidad: calcularBarandillasCombi2072(dato),
         },
         {
            pieza: "AM.3000",
            cantidad: valorBarandillasCombi0732,
         },
         {
            pieza: "AM.3400",
            cantidad: calcularRodapie3072E(dato),
         },
         {
            pieza: "AM.3500",
            cantidad: calcularRodapie2572E(dato),
         },
         {
            pieza: "AM.3600",
            cantidad: calcularRodapie2072E(dato),
         },
         {
            pieza: "AM.3700",
            cantidad: calcularRodapie1020E(dato),
         },
         {
            pieza: "AM.3800",
            cantidad: calcularRodapie0732E(dato),
         },
         {
            pieza: "AM.3900",
            cantidad: calcularRodapie3072C(dato),
         },
         {
            pieza: "AM.4000",
            cantidad: calcularRodapie2572C(dato),
         },
         {
            pieza: "AM.4100",
            cantidad: calcularRodapie2072C(dato),
         },
         {
            pieza: "AM.4200",
            cantidad: calcularRodapie1572C(dato),
         },
         {
            pieza: "AM.4300",
            cantidad: calcularRodapie1090C(dato),
         },
         {
            pieza: "AM.4400",
            cantidad: calcularRodapie0732C(dato),
         },
         {
            pieza: "AM.4500",
            cantidad: calcularRodapie3072N(dato),
         },
         {
            pieza: "AM.4600",
            cantidad: calcularRodapie2572N(dato),
         },
         {
            pieza: "AM.4700",
            cantidad: calcularRodapie2072N(dato),
         },
         {
            pieza: "AM.4800",
            cantidad: calcularRodapie1572N(dato),
         },
         {
            pieza: "AM.4900",
            cantidad: calcularRodapie1090N(dato),
         },
         {
            pieza: "AM.5000",
            cantidad: calcularRodapie0732N(dato),
         },
         {
            pieza: "AM.5100",
            cantidad: calcularDiagonal3072(dato),
         },
         {
            pieza: "AM.5200",
            cantidad: calcularDiagonal2572(dato),
         },
         {
            pieza: "AM.5300",
            cantidad: calcularDiagonal2072(dato),
         },
         {
            pieza: "AM.5400",
            cantidad: calcularDiagonal1572(dato),
         },
         {
            pieza: "AM.5500",
            cantidad: calcularDiagonal1090(dato),
         },
         {
            pieza: "AM.5600",
            cantidad: calcularDiagonal1020(dato),
         },
         {
            pieza: "AM.6000",
            cantidad: calcularPlataforma3072E(dato, valorPlataformaAcceso3072),
         },
         {
            pieza: "AM.6100",
            cantidad: calcularPlataforma2572E(dato, valorPlataformaAcceso2572),
         },
         {
            pieza: "AM.6200",
            cantidad: calcularPlataforma2072E(dato, valorPlataformaAcceso2072),
         },
         {
            pieza: "AM.6300",
            cantidad: calcularPlataforma290x1572E(
               dato,
               valorPlataformaAcceso1572
            ),
         },
         {
            pieza: "AM.6400",
            cantidad: calcularPlataforma290x1020E(dato),
         },
         {
            pieza: "AM.6500",
            cantidad: calcularPlataforma290x0732E(dato),
         },
         {
            pieza: "AM.6600",
            cantidad: calcularPlataforma320x3072C(
               dato,
               valorPlataformaAcceso3072
            ),
         },
         {
            pieza: "AM.6700",
            cantidad: calcularPlataforma320x2572C(
               dato,
               valorPlataformaAcceso2572
            ),
         },
         {
            pieza: "AM.6800",
            cantidad: calcularPlataforma320x2072C(
               dato,
               valorPlataformaAcceso2072
            ),
         },
         {
            pieza: "AM.6900",
            cantidad: calcularPlataforma320x1572C(
               dato,
               valorPlataformaAcceso1572
            ),
         },
         {
            pieza: "AM.7000",
            cantidad: calcularPlataforma320x1090C(dato),
         },
         {
            pieza: "AM.7100",
            cantidad: calcularPlataforma320x0732C(dato),
         },
         {
            pieza: "AM.7200",
            cantidad: calcularPlataforma190x3072C(dato),
         },
         {
            pieza: "AM.7300",
            cantidad: calcularPlataforma190x2572C(dato),
         },
         {
            pieza: "AM.7400",
            cantidad: calcularPlataforma190x2072C(dato),
         },
         {
            pieza: "AM.7410",
            cantidad: calcularPlataformaAM7410(dato),
         },
         {
            pieza: "AM.7420",
            cantidad: calcularPlataforma190x1090C(dato),
         },
         {
            pieza: "AM.7430",
            cantidad: calcularPlataforma190x1020C(dato),
         },
         {
            pieza: "AM.7440",
            cantidad: calcularPlataforma190x0732C(dato),
         },
         {
            pieza: "AM.7450",
            cantidad: valorPlataformaAcceso3072,
         },
         {
            pieza: "AM.7451",
            cantidad: valorPlataformaAcceso2572,
         },
         {
            pieza: "AM.7452",
            cantidad: valorPlataformaAcceso2072,
         },
         {
            pieza: "AM.7453",
            cantidad: valorPlataformaAcceso1572,
         },
         {
            pieza: "AM.8500",
            cantidad: valorTuboGancho1m,
         },
         {
            pieza: "AM.8600",
            cantidad: valorTuboGancho05m,
         },
         {
            pieza: "AM.8800",
            cantidad: calcularBridaGiratoria(
               valorTuboGancho1m,
               valorTuboGancho05m
            ),
         },
         {
            pieza: "CON.0100",
            cantidad: calcularPernosExpansionM12x80(
               valorTuboGancho1m,
               valorTuboGancho05m
            ),
         },
         {
            pieza: "PU.0100",
            cantidad: valorPuntal3mAzul,
         },
         {
            pieza: "PU.0700",
            cantidad: valorPuntal3mAzul,
         },
         {
            pieza: "PU.0900",
            cantidad: valorPuntal3mAzul,
         },
      ];

      return resultados.filter((item) => item.cantidad > 0);
   });
}

module.exports = {
   calcularCantidadesPorCadaPiezaDeAndamioFachada,
};
