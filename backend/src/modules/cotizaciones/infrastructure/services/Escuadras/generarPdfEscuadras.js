const db = require("../../../../../models");
const { agruparPorZonaYAtributos, agruparEscuadrasPorZonaYAtributos } = require("../mapearAtributosDelPdfService");
const { mapearAtributosValor } = require("../mapearAtributosValorService");

async function generarPdfEscuadras({ idDespiece, porcentajeDescuento }) {
  const despieceEncontrado = await db.despieces.findByPk(idDespiece);

  let atributosDelPdf = [];

  if (despieceEncontrado.detalles_opcionales) {
    atributosDelPdf = despieceEncontrado?.detalles_opcionales.map(
      (atributo) => ({
        zona: atributo.zona,
        atributos: atributo.atributos_formulario.map((at) => ({
          escuadra: at.escuadra,
          tipoAnclaje: at.tipoAnclaje,
          sobrecarga: at.sobrecarga,
          factorSeguridad: at.factorSeguridad,
          longTramo: at.longTramo,
          tipoPlataforma: at.tipoPlataforma,
          cantidadEscuadrasTramo: at.cantidadEscuadrasTramo,
        })),
        //nota_zona: atributo.atributos[0].nota_zona,
      })
    );
    console.dir(atributosDelPdf, { depth: null, colors: true });
  }

  // Obtener la lista de atributos:
  // Ojo se hace esta consulta solamente para saber el nombre de la zona porque los atributos ya se tienen en el campo detalles_opcionales del despiece

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

  console.log('RESULTADO', resultado);

  console.dir(atributosDelPdf, { depth: null, colors: true });

  // agregar la cantidad de escuadras por tramo a cada resultado
  // buscando en los atributos del PDF 
  // y comparando con los atributos del resultado
 const resultadoConCantidad = resultado.map((r) => {
  const zonaEncontrada = atributosDelPdf.find((z) => z.zona === r.zona);
  if (!zonaEncontrada) return r;

  // Buscar el índice del primer atributo coincidente
  const index = zonaEncontrada.atributos.findIndex(
    (a) =>
      a.escuadra === r.escuadra &&
      a.tipoAnclaje === r.tipoAnclaje &&
      a.sobrecarga === r.sobrecarga &&
      a.factorSeguridad === r.factorSeguridad &&
      a.longTramo === r.longTramo &&
      a.tipoPlataforma === r.tipoPlataforma
  );

  if (index === -1) {
    console.warn("No se encontró match para:", r);
    return r; // No hay match exacto
  }

  // Extraer y eliminar el atributo coincidente para evitar duplicados
  const [atributoEncontrado] = zonaEncontrada.atributos.splice(index, 1);

  return {
    ...r,
    cantidadEscuadrasTramo: atributoEncontrado?.cantidadEscuadrasTramo ?? 0,
  };
});


  const listaAtributos = agruparEscuadrasPorZonaYAtributos(resultadoConCantidad);

  // Obtener las piezas adicionales

  const piezasDetalleAdicionalesEscuadras = await db.despieces_detalle.findAll({
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

  const piezasDetalleAdicionalesEscuadrasConDescuento =
    piezasDetalleAdicionalesEscuadras.map((p) => {
      const pieza = p.get({ plain: true });

      return {
        ...pieza,
        precio_venta_dolares: parseFloat(
          (
            (100 - porcentajeDescuento) *
            pieza.precio_venta_dolares *
            0.01
          ).toFixed(2)
        ),
        precio_venta_soles: parseFloat(
          (
            (100 - porcentajeDescuento) *
            pieza.precio_venta_soles *
            0.01
          ).toFixed(2)
        ),
        precio_alquiler_soles: parseFloat(
          (
            (100 - porcentajeDescuento) *
            pieza.precio_alquiler_soles *
            0.01
          ).toFixed(2)
        ),
      };
    });

  return {
    zonas: listaAtributos,
    piezasAdicionales: piezasDetalleAdicionalesEscuadrasConDescuento,
  };
}

module.exports = {
  generarPdfEscuadras,
};
