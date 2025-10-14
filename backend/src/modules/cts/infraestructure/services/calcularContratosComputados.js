const filtrarContratosSinInterrupcion = require("../../../../services/filtrarContratosSinInterrupcion");

const calcularContratosComputados = (
   fechaInicioRango,
   fechaFinRango,
   objetos
) => {
   // console.log('Inicio de rango en el filtro: ',fechaInicioRango);
   // console.log('Fin de rango en el filtro: ',fechaFinRango);
   
   
   //Retorna los contratos que se encuentran dentro del periodo de la cts
   let filtrados = objetos.filter((obj) => {
      const inicio = obj.fecha_inicio;
      const fin = obj.fecha_fin;

      return (
         (inicio >= fechaInicioRango && inicio <= fechaFinRango) ||
         (fin >= fechaInicioRango && fin <= fechaFinRango) ||
         (inicio <= fechaInicioRango && fin >= fechaFinRango)
      );
   });
   return filtrarContratosSinInterrupcion(filtrados);
};

module.exports = calcularContratosComputados;
