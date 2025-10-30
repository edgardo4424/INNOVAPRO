const db = require("../../../../../database/models");
const { agruparPorZonaYAtributos } = require("../mapearAtributosDelPdfService");
const { mapearAtributosValor } = require("../mapearAtributosValorService");

async function generarPdfAndamioTrabajo({
  idDespiece,
  tiene_pernos,
  porcentajeDescuento,
  transaction = null,
}) {

  let pernoExpansionConArgolla;
  let pernoEnElDespiece;

  if (tiene_pernos) {
    pernoExpansionConArgolla = await db.piezas.findOne({
      where: {
        item: "CO.0010",
      },
    }, { transaction });

    pernoEnElDespiece = await db.despieces_detalle.findOne({
      where: {
        despiece_id: idDespiece,
        pieza_id: pernoExpansionConArgolla.id,
      },
    }, { transaction });
  }

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
      longitud_mm: at.longitud / 1000,
      ancho_mm: at.ancho / 1000,
      altura_m: at.altura,
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
    }, { transaction });

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
    atributos_opcionales: {
      tiene_pernos: tiene_pernos,
      nombre_perno_expansion: tiene_pernos
        ? pernoExpansionConArgolla.descripcion
        : null,
      precio_perno_expansion: tiene_pernos
        ? Number(pernoEnElDespiece?.precio_venta_soles).toFixed(2)
        : null,
      cantidad_pernos_expansion: tiene_pernos
        ? pernoEnElDespiece?.cantidad
        : null,
    },
    piezasAdicionales: piezasDetalleAdicionalesAndamioTrabajoConDescuento,
  };
}

module.exports = {
  generarPdfAndamioTrabajo,
};