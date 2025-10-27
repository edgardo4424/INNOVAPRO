const db = require("../../../../../database/models");
const { agruparPorZonaYAtributos } = require("../mapearAtributosDelPdfService");
const { mapearAtributosValor } = require("../mapearAtributosValorService");

async function generarPdfColgante({
  dataDespiece,
  idDespiece,
  porcentajeDescuento,
  transaction = null,
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
  }, { transaction });

  // Obtener atributos

  const resultado = mapearAtributosValor(atributosDelUso);

  const listaAtributos = agruparPorZonaYAtributos(resultado);

  const atributosDelPdf = listaAtributos.map((atributo) => ({
    zona: atributo.zona,
    atributos: atributo.atributos.map((at) => ({
      cantidad: at.cantidad,
      tipoServicio: at.tipoServicio,
      alturaEdificio: at.alturaEdificio,
      sistemaSoporte: at.sistemaSoporte
    })),
    nota_zona: atributo.atributos[0].nota_zona,
  }));

  // Obtener las piezas adicionales

  const piezasDetalleAdicionalesColgante =
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
    }, { transaction });

  const piezasDetalleAdicionalesColganteConDescuento =
  piezasDetalleAdicionalesColgante.map((p) => {
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

  const { detalles_opcionales } = dataDespiece

  return {
    zonas: atributosDelPdf,
    piezasAdicionales: piezasDetalleAdicionalesColganteConDescuento,
    detalles_colgantes: detalles_opcionales,
  };
}

module.exports = {
  generarPdfColgante,
};
