const {
  agruparPorPieza,
  calcularSubtotales,
  mapearPiezasConDatos,
  combinarResultados,
  calcularTotalesGenerales,
  unificarDespiecesConTotales,
} = require("../../helpers/despieceUtils");

const db = require("../../../../../database/models");
const { calcularCantidadesPorCadaPiezaDeEscalera } = require("./calcularCantidadesEscalera");

const CONST_ID_USO_ESCALERA = 3;

async function generarDespieceEscalera(zonas) {

  const precio_por_tramo_alquiler = 300; // Precio por tramo de escalera en soles

  const resultadosPorZona = await Promise.all(
    zonas.map(async (dataPorZona) => {
  
      const todosDespieces = calcularCantidadesPorCadaPiezaDeEscalera(
        dataPorZona.atributos_formulario
      );


      if (todosDespieces[0].length === 0)
        throw new Error("No hay piezas en la modulación. Ingrese bien los atributos");

      const resultadoFinal = agruparPorPieza(todosDespieces,  dataPorZona.atributos_formulario.length);
      const subtotales = calcularSubtotales(resultadoFinal);

      const piezasBD = await db.piezas_usos.findAll({
        where: { uso_id: CONST_ID_USO_ESCALERA },
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

      const alturasPorZona = dataPorZona.atributos_formulario.map(atributo => atributo.alturaTotal);

      const sumarTotalAlturas = alturasPorZona.reduce((total, altura) => total + altura, 0);

      let numero_tramos = sumarTotalAlturas / 2;
    
      let tramos_2m = numero_tramos;
      let tramos_1m = 0;
      if (sumarTotalAlturas % 2 !== 0) {
        tramos_2m = numero_tramos - 0.5; //5
        tramos_1m = 1
        numero_tramos = numero_tramos + 0.5;
        
      }
      const precioSubtotalAlquilerSoles = numero_tramos * precio_por_tramo_alquiler;
    
      return {
        despiece: resultadosCombinados,
        total_piezas: subtotales.total,
        peso_total_kg: totales.peso_kg.toFixed(2),
        peso_total_ton: (totales.peso_kg / 1000).toFixed(2),
        precio_subtotal_venta_dolares: totales.precio_venta_dolares.toFixed(2),
        precio_subtotal_venta_soles: totales.precio_venta_soles.toFixed(2),
        precio_subtotal_alquiler_soles: precioSubtotalAlquilerSoles,
        altura_total_general: sumarTotalAlturas,
        tramos_2m,
        tramos_1m
      };
    })
  );

  const obtenerAlturasPorZona = resultadosPorZona.map(zona => zona.altura_total_general);

  const totalAlturaGeneral = obtenerAlturasPorZona.reduce((total, altura) => total + altura, 0);

  const totalTramos2mPorZona = resultadosPorZona.map(zona => zona.tramos_2m)
  const totalTramos1mPorZona = resultadosPorZona.map(zona => zona.tramos_1m)


   const totalTramos2m = totalTramos2mPorZona.reduce((total, tramos_2m) => total + tramos_2m, 0);
 const totalTramos1m = totalTramos1mPorZona.reduce((total, tramos_1m) => total + tramos_1m, 0);
 
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
    ...resultadoFinal.totales,
    detalles_escaleras: {
      precio_por_tramo_alquiler: precio_por_tramo_alquiler,
      altura_total_general: totalAlturaGeneral,
      tramos_2m: totalTramos2m,
      tramos_1m: totalTramos1m
    }
  };

}



module.exports = {
  generarDespieceEscalera, // Exporta la función para que pueda ser utilizada en otros módulos
};
