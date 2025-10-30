const db = require("../../../../../database/models");
const {
  agruparPuntalesPorZonaYAtributos,
} = require("../mapearAtributosDelPdfService");
const { mapearAtributosValor } = require("../mapearAtributosValorService");

async function generarPdfPuntales({ idDespiece, tipo_cotizacion, porcentajeDescuento, transaction = null }) {
  
  // Obtener la lista de atributos

  const atributosDelUsoPuntales = await db.atributos_valor.findAll({
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

  const resultadoPuntales = mapearAtributosValor(atributosDelUsoPuntales);

  const atributosPuntalesDelPdf =
    agruparPuntalesPorZonaYAtributos(resultadoPuntales);

  const atributosPuntalesConPreciosDelPdf = await Promise.all(
    atributosPuntalesDelPdf.map(async (zona) => {
      const atributosConPrecios = await Promise.all(
        zona.atributos.map(async (atributo) => {
          const tipoPuntal = atributo.tipoPuntal;

          let puntal;
          if (tipoPuntal === "3.00 m") puntal = "PU.0100";
          else if (tipoPuntal === "4.00 m") puntal = "PU.0200";
          else if (tipoPuntal === "5.00 m") puntal = "PU.0300";

          const piezaPuntal = await db.piezas.findOne({
            where: { item: puntal },
          }, { transaction });

          if (!piezaPuntal) {
            throw new Error(`No se encontró la pieza con item ${puntal}`);
          }

          const piezaPuntalDespiece = await db.despieces_detalle.findOne({
            where: {
              despiece_id: idDespiece,
              pieza_id: piezaPuntal.id,
            },
          }, { transaction });

          if (!piezaPuntalDespiece) {
            throw new Error(
              `No se encontró despiece para pieza_id ${piezaPuntal.id}`
            );
          }

          let precioUnitarioPuntal;

          if (tipo_cotizacion === "Venta") {
            precioUnitarioPuntal = (
              piezaPuntalDespiece.precio_venta_soles /
              piezaPuntalDespiece.cantidad
            ).toFixed(2);
          } else if (tipo_cotizacion === "Alquiler") {
            precioUnitarioPuntal = (
              piezaPuntalDespiece.precio_alquiler_soles /
              piezaPuntalDespiece.cantidad
            ).toFixed(2);
          }

          const subtotal = (precioUnitarioPuntal * atributo.cantidad).toFixed(
            2
          );

          return {
            ...atributo,
            precio_unitario: precioUnitarioPuntal,
            subtotal,
          };
        })
      );

      // 👇 este return es lo que FALTABA
      return {
        zona: zona.zona,
        nota_zona: zona.nota_zona,
        atributos: atributosConPrecios,
      };
    })
  );

  // Averiguar que tipos de puntales se registraron en la cotizacion

  const tiposPuntalUnicos = [
    // Convertimos a un array los valores únicos usando Set
    ...new Set(
      // Recorremos cada zona con flatMap para aplanar los resultados
      atributosPuntalesDelPdf.flatMap((item) =>
        // De cada zona, accedemos al array "atributos" y sacamos el campo tipoPuntal
        item.atributos.map((attr) => attr.tipoPuntal)
      )
    ),
  ];

  const piezasVenta = await Promise.all(
    tiposPuntalUnicos.map(async (tipo, i) => {

      let itemPiezaPinPresion;
      let itemArgolla;
      switch (tipo) {
        case "5.00 m":
          itemPiezaPinPresion = "PU.0400";
          itemArgolla = "PU.0500";
          break;

        case "4.00 m":
          itemPiezaPinPresion = "PU.0350";
          itemArgolla = "PU.0450";
          break;
        case "3.00 m":
          itemPiezaPinPresion = "PU.0350";
          itemArgolla = "PU.0450";
          break;
        default:
         /*  console.warn("❌ Tipo de puntal no reconocido:", tipo); */
          return null;
      }

      const piezaPinPresion = await db.piezas.findOne({
        where: { item: itemPiezaPinPresion },
      }, { transaction });
      const piezaArgolla = await db.piezas.findOne({
        where: { item: itemArgolla },
      }, { transaction });

      if (!piezaPinPresion || !piezaArgolla) {
        //console.warn(`⚠️ (${i}) No se encontraron piezas con item ${itemPiezaPinPresion} o ${itemArgolla}`);
        return {
          tipo,
          piezaVentaPinPresion: null,
          piezaVentaArgolla: null,
        };
      }

      const pinPresion = await db.despieces_detalle.findOne({
        where: {
          despiece_id: Number(idDespiece),
          pieza_id: Number(piezaPinPresion.id),
        },
      }, { transaction });

      const argolla = await db.despieces_detalle.findOne({
        where: {
          despiece_id: Number(idDespiece),
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
        tipo,
        piezaVentaPinPresion: ventaPin,
        piezaVentaArgolla: ventaArg,
      };
    })
  );

  // Obtener la cantidad de tripode

  const piezaTripodeEncontrado = await db.piezas.findOne({
    where: {
      item: "PU.0550",
    },
  }, { transaction });

  const piezaTripodeDespieceDetalle = await db.despieces_detalle.findOne({
    where: {
      despiece_id: idDespiece,
      pieza_id: piezaTripodeEncontrado.id,
    },
  }, { transaction });

  // Obtener las piezas adicionales

  const piezasDetalleAdicionalesPuntales = await db.despieces_detalle.findAll({
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

   const piezasDetalleAdicionalesPuntalesConDescuento =
  piezasDetalleAdicionalesPuntales.map((p) => {
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
    zonas: atributosPuntalesConPreciosDelPdf,
    tripode: {
      nombre: piezaTripodeEncontrado.descripcion,
      total: piezaTripodeDespieceDetalle?.cantidad || 0,
      precio_venta_dolares: piezaTripodeDespieceDetalle?.precio_venta_dolares || 0,
      precio_venta_soles: piezaTripodeDespieceDetalle?.precio_venta_soles || 0,
      precio_alquiler_soles: piezaTripodeDespieceDetalle?.precio_alquiler_soles || 0,
    },
    atributos_opcionales: piezasVenta,
    piezasAdicionales: piezasDetalleAdicionalesPuntalesConDescuento,
  };
}

module.exports = {
  generarPdfPuntales,
};