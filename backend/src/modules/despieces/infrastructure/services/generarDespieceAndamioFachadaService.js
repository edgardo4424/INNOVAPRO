const { calcularCantidadesPorCadaPiezaDeAndamioFachada } = require("./calcularCantidadesAndamioFachada");

async function generarDespieceAndamioDeFachada(data) {
   const resultadosPorZona = await Promise.all(
      data.map(async (dataPorZona) => {
         //Aca se comienza a trabajar con los datos del atributo: "atributos_formulario"
         const datosConCantidadAndamios = dataPorZona.atributos_formulario.map(
            (d, index) => ({
               ...d,
               cantidadAndamios: index++,
            })
         );
        //    console.log(datosConCantidadAndamios);

         const todosDespieces = calcularCantidadesPorCadaPiezaDeAndamioFachada(datosConCantidadAndamios);
         console.log(todosDespieces);
      })
   );
}

module.exports = {
   generarDespieceAndamioDeFachada, // Exporta la función para que pueda ser utilizada en otros módulos
};
