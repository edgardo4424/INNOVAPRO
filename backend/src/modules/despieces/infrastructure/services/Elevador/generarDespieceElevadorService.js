const {
  agruparPorPieza,
  calcularSubtotales,
  mapearPiezasConDatos,
  combinarResultados,
  calcularTotalesGenerales,
  unificarDespiecesConTotales,
} = require("../../helpers/despieceUtils");

const db = require("../../../../../models");
const { calcularCantidadesPorCadaPiezaDeElevador } = require("./calcularCantidadesPuntales");

const CONST_ID_USO_ELEVADOR = 9;

async function generarDespieceElevador(data) {


  const resultadosPorZona = await Promise.all(
    data.map(async (dataPorZona) => {
      
      const todosDespieces = calcularCantidadesPorCadaPiezaDeElevador(
        dataPorZona.atributos_formulario
      );


      if (todosDespieces[0].length === 0)
        throw new Error("No hay piezas en la modulación. Ingrese bien los atributos");

      const resultadoFinal = agruparPorPieza(todosDespieces,  dataPorZona.atributos_formulario.length);
      const subtotales = calcularSubtotales(resultadoFinal);

      const piezasBD = await db.piezas_usos.findAll({
        where: { uso_id: CONST_ID_USO_ELEVADOR },
        include: [{ model: db.piezas, as: "pieza" }],
        raw: true,
      });

      const piezaInfoMap = mapearPiezasConDatos(piezasBD);
      const resultadosCombinados = combinarResultados(resultadoFinal, piezaInfoMap);
      const totales = calcularTotalesGenerales(resultadosCombinados);

      console.table(resultadosCombinados);
      console.log("🔢 Totales generales:");
      console.log(`🧩 Total de piezas: ${subtotales.total}`);
      console.log(`📦 Peso total (kg): ${totales.peso_kg.toFixed(2)}`);
      console.log(`📦 Peso total (Ton): ${(totales.peso_kg / 1000).toFixed(2)}`);
      console.log(`💰 Precio subtotal de venta dolares ($): ${totales.precio_venta_dolares.toFixed(2)}`);
      console.log(`💰 Precio subtotal de venta soles (S/): ${totales.precio_venta_soles.toFixed(2)}`);
      console.log(`📅 Precio subtotal de alquiler soles (S/): ${totales.precio_alquiler_soles.toFixed(2)}`);

      return {
        despiece: resultadosCombinados,
        total_piezas: subtotales.total,
        peso_total_kg: totales.peso_kg.toFixed(2),
        peso_total_ton: (totales.peso_kg / 1000).toFixed(2),
        precio_subtotal_venta_dolares: totales.precio_venta_dolares.toFixed(2),
        precio_subtotal_venta_soles: totales.precio_venta_soles.toFixed(2),
        precio_subtotal_alquiler_soles: totales.precio_alquiler_soles.toFixed(2),
      };
    })
  );

  const resultadoFinal = unificarDespiecesConTotales(resultadosPorZona);

console.table(resultadoFinal.despiece);

console.log("🔢 Totales generales unificados:");
console.log(`🧩 Total de piezas: ${resultadoFinal.totales.total_piezas}`);
console.log(`📦 Peso total (kg): ${resultadoFinal.totales.peso_total_kg.toFixed(2)}`);
console.log(`📦 Peso total (Ton): ${resultadoFinal.totales.peso_total_ton}`);
console.log(`💰 Precio subtotal venta $: ${resultadoFinal.totales.precio_subtotal_venta_dolares.toFixed(2)}`);
console.log(`💰 Precio subtotal venta S/: ${resultadoFinal.totales.precio_subtotal_venta_soles.toFixed(2)}`);
console.log(`📅 Precio subtotal alquiler S/: ${resultadoFinal.totales.precio_subtotal_alquiler_soles.toFixed(2)}`);

  return {
    despiece: resultadoFinal.despiece,
    ...resultadoFinal.totales
  };
}



module.exports = {
  generarDespieceElevador, // Exporta la función para que pueda ser utilizada en otros módulos
};
