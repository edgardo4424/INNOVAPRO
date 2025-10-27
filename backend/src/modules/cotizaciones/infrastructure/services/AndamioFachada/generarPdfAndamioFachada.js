const db = require("../../../../../database/models");
const { agruparPorZonaYAtributos } = require("../mapearAtributosDelPdfService");
const { mapearAtributosValor } = require("../mapearAtributosValorService");

async function generarPdfAndamioFachada({ dataDespiece, tiene_pernos, porcentajeDescuento, transaction = null }) {
  let pernoExpansionConArgolla;
  let pernoExpansionConArgollaEnElDespiece;

  if (tiene_pernos) {
    pernoExpansionConArgolla = await db.piezas.findOne({
      where: {
        item: "CO.0010",
      },
    }, { transaction });

    if (pernoExpansionConArgolla) {
     
      pernoExpansionConArgollaEnElDespiece = await db.despieces_detalle.findOne(
        {
          where: {
            despiece_id: dataDespiece.id,
            pieza_id: pernoExpansionConArgolla.id,
          },
        }, { transaction }
      );
    }

  }

  // Obtener la lista de atributos

  const atributosDelUso = await db.atributos_valor.findAll({
    where: {
      despiece_id: dataDespiece.id,
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
    atributos: atributo.atributos.map((at) => {
      
      return {
        longitud_mm: at.longitud /1000,
        ancho_mm: at.ancho / 1000,
        altura_m: at.alturaAndamio,
        cantidad_uso: at.cantidad_uso,
      };
    }),
    nota_zona: atributo.atributos[0].nota_zona,
  }));

  // Obtener las piezas adicionales

  const piezasDetalleAdicionalesAndamioFachada =
    await db.despieces_detalle.findAll({
      where: {
        despiece_id: dataDespiece.id,
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

     const piezasDetalleAdicionalesAndamioFachadaConDescuento =
  piezasDetalleAdicionalesAndamioFachada.map((p) => {
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

  // Obtener los detalles puntales

  const puntalEncontrado = await db.piezas.findOne({
    where: { item: "PU.0100"}
  }, { transaction });

  const piezaPinPresion = await db.piezas.findOne({
    where: { item: "PU.0350" },
  }, { transaction });
  const piezaArgolla = await db.piezas.findOne({
    where: { item: "PU.0450" },
  }, { transaction });

  console.log({
    dataDespieceId: dataDespiece.id,
    puntalEncontradoId: puntalEncontrado.id,
  })

  const puntal = await db.despieces_detalle.findOne({
    where: {
      despiece_id: Number(dataDespiece.id),
      pieza_id: Number(puntalEncontrado.id),
    }
  }, { transaction });

  const pinPresion = await db.despieces_detalle.findOne({
    where: {
      despiece_id: Number(dataDespiece.id),
      pieza_id: Number(piezaPinPresion.id),
    },
  }, { transaction });

  const argolla = await db.despieces_detalle.findOne({
    where: {
      despiece_id: Number(dataDespiece.id),
      pieza_id: Number(piezaArgolla.id),
    },
  }, { transaction });

  const ventaPin = pinPresion
    ? (pinPresion.precio_venta_soles / pinPresion.cantidad).toFixed(2)
    : null;
  const ventaArg = argolla
    ? (argolla.precio_venta_soles / argolla.cantidad).toFixed(2)
    : null;

  

  return {
    zonas: atributosDelPdf,
    /* atributos_opcionales: {
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
    }, */
    piezasAdicionales: piezasDetalleAdicionalesAndamioFachadaConDescuento,
    perno_expansion_con_argolla: {
      nombre: pernoExpansionConArgolla?.descripcion || "",
      total: pernoExpansionConArgollaEnElDespiece?.cantidad || 0,
      precio_venta_dolares:
        pernoExpansionConArgollaEnElDespiece?.precio_venta_dolares || 0,
      precio_venta_soles:
        pernoExpansionConArgollaEnElDespiece?.precio_venta_soles || 0,
      precio_alquiler_soles:
        pernoExpansionConArgollaEnElDespiece?.precio_alquiler_soles || 0,
    },
    detalles_puntales: {
      puntal: {
        tipo: "3.00 m",
        descripcion: puntalEncontrado?.descripcion,
        cantidad: puntal?.cantidad || 0,
        subtotal_alquiler_soles: puntal?.precio_alquiler_soles,
        subtotal_venta_soles: puntal?.precio_venta_soles,
        subtotal_venta_dolares: puntal?.precio_venta_dolares,
      },
      piezaVentaPinPresion: ventaPin || 0,
      piezaVentaArgolla: ventaArg || 0
    }
  };
}

module.exports = {
  generarPdfAndamioFachada,
};
