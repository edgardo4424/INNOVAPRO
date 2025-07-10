const db = require("../../../../../models");
const { agruparPorZonaYAtributos } = require("../mapearAtributosDelPdfService");
const { mapearAtributosValor } = require("../mapearAtributosValorService");

async function generarPdfPlataformaDescarga({
  idDespiece,
  porcentajeDescuento,
}) {

  
  // Obtener la lista de atributos

  const atributosDelUso = await db.atributos_valor.findAll({
    where: {
      despiece_id: idDespiece,
    },
    include: [
      {
        model: db.atributos,
        as: "atributo",
      },
    ],
  });

  // Obtener atributos

  const resultado = mapearAtributosValor(atributosDelUso);

  const listaAtributos = agruparPorZonaYAtributos(resultado);

  const atributosDelPdf = listaAtributos.map((atributo) => ({
    zona: atributo.zona,
    atributos: atributo.atributos.map((at) => ({
      capacidad: at.capacidad,
      antiguedad: at.antiguedad,
      traspaleta: at.traspaleta,
      cantidad_uso: at.cantidad_uso,
    })),
    nota_zona: atributo.atributos[0].nota_zona,
  }));

  // Obtener las piezas adicionales

  const piezasDetalleAdicionalesAndamioTrabajo =
    await db.despieces_detalle.findAll({
      where: {
        despiece_id: idDespiece,
        esAdicional: true,
      },
      include: [
        {
          model: db.piezas,
          as: "pieza",
          attributes: ["id", "item", "descripcion"],
        },
      ],
    });

  const piezasDetalleAdicionalesAndamioTrabajoConDescuento =
  piezasDetalleAdicionalesAndamioTrabajo.map((p) => {
    const pieza = p.get({ plain: true });

    return {
      ...pieza,
      precio_venta_dolares: parseFloat(
        ((100 - porcentajeDescuento) * pieza.precio_venta_dolares * 0.01).toFixed(2)
      ),
      precio_venta_soles: parseFloat(
        ((100 - porcentajeDescuento) * pieza.precio_venta_soles * 0.01).toFixed(2)
      ),
      precio_alquiler_soles: parseFloat(
        ((100 - porcentajeDescuento) * pieza.precio_alquiler_soles * 0.01).toFixed(2)
      ),
    };
  });

  return {
    zonas: atributosDelPdf,
    piezasAdicionales: piezasDetalleAdicionalesAndamioTrabajoConDescuento,
  };
}

module.exports = {
  generarPdfPlataformaDescarga,
};
