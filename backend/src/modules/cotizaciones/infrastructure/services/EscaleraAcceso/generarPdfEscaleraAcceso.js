const db = require("../../../../../models");
const { agruparPorZonaYAtributos } = require("../mapearAtributosDelPdfService");

const { mapearAtributosValor } = require("../mapearAtributosValorService");

async function generarPdfEscaleraAcceso({ dataDespiece, tiene_pernos, porcentajeDescuento }) {
  let pernoExpansionConArgolla;
  let pernoExpansionConArgollaEnElDespiece;

  let pernoExpansionSinArgolla;
  let pernoExpansionSinArgollaEnElDespiece;

  if (tiene_pernos) {
    pernoExpansionConArgolla = await db.piezas.findOne({
      where: {
        item: "CON.0100",
      },
    });

    if (pernoExpansionConArgolla) {

      console.log('entre 1er if');
      pernoExpansionConArgollaEnElDespiece = await db.despieces_detalle.findOne(
        {
          where: {
            despiece_id: dataDespiece.id,
            pieza_id: pernoExpansionConArgolla.id,
          },
        }
      );
    }

    console.log('pernoExpansionConArgollaEnElDespiece', pernoExpansionConArgollaEnElDespiece);

    pernoExpansionSinArgolla = await db.piezas.findOne({
      where: {
        item: "CON.0200",
      },
    });

    if (pernoExpansionSinArgolla) {
      console.log('entre 2do if');
      pernoExpansionSinArgollaEnElDespiece = await db.despieces_detalle.findOne(
        {
          where: {
            despiece_id: dataDespiece.id,
            pieza_id: pernoExpansionSinArgolla.id,
          },
        }
      );
    }

    console.log('pernoExpansionSinArgollaEnElDespiece', pernoExpansionSinArgollaEnElDespiece);
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
  });

  // Obtener atributos

  const resultado = mapearAtributosValor(atributosDelUso);

  const listaAtributos = agruparPorZonaYAtributos(resultado);

  const atributosDelPdf = listaAtributos.map((atributo) => ({
    zona: atributo.zona,
    atributos: atributo.atributos.map((at) => {
      const tipoEscalera = at.tipoEscalera;
      let longitud_mm;

      if (tipoEscalera == "EUROPEA") {
        longitud_mm = 2072 / 1000;
      } else {
        longitud_mm = 3072 / 1000;
      }

      let ancho_mm = 1572 / 1000;

      return {
        longitud_mm: longitud_mm,
        ancho_mm: ancho_mm,
        altura_m: at.alturaTotal,
        cantidad_uso: at.cantidad_uso,
        // CANTIDAD DE TRAMOS 2M Y CANTIDAD DE TRAMOS 1M
      };
    }),
    nota_zona: atributo.atributos[0].nota_zona,
  }));

  // Obtener las piezas adicionales

  const piezasDetalleAdicionalesEscaleraAcceso =
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
    });

      const piezasDetalleAdicionalesEscaleraAccesoConDescuento =
  piezasDetalleAdicionalesEscaleraAcceso.map((p) => {
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

  // Calcular los tramos de 2m y 1m

  console.log('dataDespiece', dataDespiece.detalles_opcionales);
    
  const { detalles_opcionales } = dataDespiece

  return {
    zonas: atributosDelPdf,
    piezasAdicionales: piezasDetalleAdicionalesEscaleraAccesoConDescuento,
    perno_expansion_con_argolla: {
      nombre: pernoExpansionConArgolla?.descripcion || "",
      total: pernoExpansionConArgollaEnElDespiece?.cantidad || 0,
      precio_venta_dolares: pernoExpansionConArgollaEnElDespiece?.precio_venta_dolares || 0,
      precio_venta_soles: pernoExpansionConArgollaEnElDespiece?.precio_venta_soles || 0,
      precio_alquiler_soles: pernoExpansionConArgollaEnElDespiece?.precio_alquiler_soles || 0,
    },
    perno_expansion_sin_argolla: {
      nombre: pernoExpansionSinArgolla?.descripcion || "",
      total: pernoExpansionSinArgollaEnElDespiece?.cantidad || 0,
      precio_venta_dolares: pernoExpansionSinArgollaEnElDespiece?.precio_venta_dolares || 0,
      precio_venta_soles: pernoExpansionSinArgollaEnElDespiece?.precio_venta_soles || 0,
      precio_alquiler_soles: pernoExpansionSinArgollaEnElDespiece?.precio_alquiler_soles || 0,
    },
    detalles_escaleras: {
      ...detalles_opcionales
    }
  };
}

module.exports = {
  generarPdfEscaleraAcceso,
};
