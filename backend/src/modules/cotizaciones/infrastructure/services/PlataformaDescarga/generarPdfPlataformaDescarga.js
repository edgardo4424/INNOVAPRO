const db = require("../../../../../database/models");
const { agruparPorZonaYAtributos } = require("../mapearAtributosDelPdfService");
const { mapearAtributosValor } = require("../mapearAtributosValorService");

async function generarPdfPlataformaDescarga({
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
      capacidad: at.capacidad,
      antiguedad: at.antiguedad,
      traspaleta: at.traspaleta,
      cantidad_uso: at.cantidad_uso,
    })),
    nota_zona: atributo.atributos[0].nota_zona,
  }));

  // Obtener las piezas adicionales

  const piezasDetalleAdicionalesPlataformaDescarga =
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

  const piezasDetalleAdicionalesPlataformaDescargaConDescuento =
  piezasDetalleAdicionalesPlataformaDescarga.map((p) => {
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

  /* OBTENER ATRIBUTOS OPCIONALES */
  let piezasVenta = []

if(piezasDetalleAdicionalesPlataformaDescargaConDescuento.length>0){

  const listaItemsPuntales = ['PU.0100', 'PU.0200', 'PU.0300']
    const listaPuntales = piezasDetalleAdicionalesPlataformaDescargaConDescuento.filter(p => listaItemsPuntales.includes(p.pieza.item))
      
    const listaItemsPuntalesAdicionales = listaPuntales.map(p => p.pieza.item)
   
     piezasVenta = await Promise.all(
        listaItemsPuntalesAdicionales.map(async (item, i) => {
    
          let itemPiezaPinPresion;
          let itemArgolla;
          let tipo;
          switch (item) {
            case "PU.0300":  // Puntal de 5m
              itemPiezaPinPresion = "PU.0400";
              itemArgolla = "PU.0500";

              tipo = "5.00 m"
              break;
    
            case "PU.0200":  // Puntal 4m
              itemPiezaPinPresion = "PU.0350";
              itemArgolla = "PU.0450";

              tipo = "4.00 m"
              break;

            case "PU.0100":  // Puntal 3m
              itemPiezaPinPresion = "PU.0350";
              itemArgolla = "PU.0450";

              tipo = "3.00 m"
              break;
            default:
             // console.warn("❌ Tipo de puntal no reconocido:", tipo); 
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
    
          //console.log(`✅ (${i}) IDs buscados: pin=${piezaPinPresion.id}, argolla=${piezaArgolla.id}`);
          //console.log(`✅ (${i}) Encontrado: pin=${!!pinPresion}, argolla=${!!argolla}`);
    
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
  } 

  /* FIN OBTENER ATRIBUTOS OPCIONALES */

  return {
    zonas: atributosDelPdf,
    piezasAdicionales: piezasDetalleAdicionalesPlataformaDescargaConDescuento,

   atributos_opcionales: piezasVenta,
  };
}

module.exports = {
  generarPdfPlataformaDescarga,
};
