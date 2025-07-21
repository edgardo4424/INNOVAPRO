const db = require("../../../../../models");
const { agruparPorZonaYAtributos, agruparEscuadrasPorZonaYAtributos } = require("../mapearAtributosDelPdfService");
const { mapearAtributosValor } = require("../mapearAtributosValorService");

async function generarPdfEscuadrasSinPlataformas({ idDespiece, porcentajeDescuento }) {
  
  console.log({idDespiece, porcentajeDescuento});
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

    console.dir(listaAtributos, { depth: null });
  
    const atributosDelPdf = listaAtributos.map((atributo) => ({
      zona: atributo.zona,
      atributos: atributo.atributos.map((at) => ({
        escuadra: at.escuadra,
        tipoAnclaje: at.tipoAnclaje,
        sobrecarga: at.sobrecarga,
        factorSeguridad: at.factorSeguridad,
        cantidad_uso: at.cantidad_uso,
      })),
      nota_zona: atributo.atributos[0].nota_zona,
    }));

    // Obtener las piezas escuadras
      const piezasEscuadrasEncontradas = await db.despieces_detalle.findAll({
        where: {
          despiece_id: idDespiece,
          esAdicional: false,
        },
        include: [
          {
            model: db.piezas,
            as: "pieza",
            where: {
              item: ["EC.0100", "EC.0300"],
            },
          },
        ],
      });
    
      // calcular totales detalles escuadras
      const totalesDetallesEscuadras = piezasEscuadrasEncontradas.reduce(
        (acc, item) => {
          acc.cantidad += item.cantidad;
          acc.precio_alquiler_soles += parseFloat(item.precio_alquiler_soles);
          acc.precio_venta_soles += parseFloat(item.precio_venta_soles);
          acc.precio_venta_dolares += parseFloat(item.precio_venta_dolares);
          return acc;
        },
        {
          cantidad: 0,
          precio_alquiler_soles: 0,
          precio_venta_soles: 0,
          precio_venta_dolares: 0
        }
      );
    
  
    // Obtener las piezas adicionales
  
    const piezasDetalleAdicionalesEscuadrasSinPlataforma =
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
  
    const piezasDetalleAdicionalesEscuadrasSinPlataformaConDescuento =
    piezasDetalleAdicionalesEscuadrasSinPlataforma.map((p) => {
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

    console.log('piezasDetalleAdicionalesEscuadrasSinPlataformaConDescuento', piezasDetalleAdicionalesEscuadrasSinPlataformaConDescuento);
  

  return {
     zonas: atributosDelPdf,
      piezasAdicionales: piezasDetalleAdicionalesEscuadrasSinPlataformaConDescuento,
      detalles_escuadras: totalesDetallesEscuadras,
  };
}

module.exports = {
  generarPdfEscuadrasSinPlataformas,
};