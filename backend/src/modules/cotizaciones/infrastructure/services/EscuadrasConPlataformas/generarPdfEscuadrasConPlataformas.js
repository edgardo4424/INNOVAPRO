const db = require("../../../../../database/models");
const { agruparPorZonaYAtributos, agruparEscuadrasPorZonaYAtributos } = require("../mapearAtributosDelPdfService");
const { mapearAtributosValor } = require("../mapearAtributosValorService");

async function generarPdfEscuadrasConPlataformas({ idDespiece, porcentajeDescuento, transaction = null }) {
  const despieceEncontrado = await db.despieces.findByPk(idDespiece, {},{ transaction });

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
  }, { transaction });

  // Obtener atributos

  const resultado = mapearAtributosValor(atributosDelUso);

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
  }, { transaction });

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

  // Obtener las piezas que empiecen con el item AM. en despieces_detalle
  const piezasPlataformasEncontrado = await db.despieces_detalle.findAll({
    where: {
      despiece_id: idDespiece,
      esAdicional: false,
    },
    include: [
      {
        model: db.piezas,
        as: "pieza",
        where: {
          item: {
            [db.Sequelize.Op.like]: "AM.%",
          },
        },
      },
    ]
  }, { transaction });

  const totalesDetallePlataformas = piezasPlataformasEncontrado.reduce(
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

// Aplicar .toFixed(2) al final (opcional: parseFloat si quieres número en vez de string)
const totalesFormateadosDetallePlataformas = {
  cantidad: totalesDetallePlataformas.cantidad,
  precio_alquiler_soles: parseFloat(totalesDetallePlataformas.precio_alquiler_soles.toFixed(2)),
  precio_venta_soles: parseFloat(totalesDetallePlataformas.precio_venta_soles.toFixed(2)),
  precio_venta_dolares: parseFloat(totalesDetallePlataformas.precio_venta_dolares.toFixed(2)),
};

  const listaAtributos = agruparEscuadrasPorZonaYAtributos(resultadoConCantidad);

  const listaAtributosConCantidadPlataformas = listaAtributos.map((zona) => {

    const atributos = zona.atributos.map((at) => {
      let cantidadPlataformas = 0;
   
      switch (at.escuadra+"") {
        case "3":
          cantidadPlataformas = 10*at.cantidad_uso;
          break;
        case "1":
        cantidadPlataformas = 3*at.cantidad_uso;
          break;
        default:
          break;
      }
      return {
        ...at,
        cantidadPlataformas: cantidadPlataformas
      }
    }
    );
    return {
      ...zona,
      atributos: atributos,
    }
  })

  
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
  }, { transaction });

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

  console.dir(listaAtributosConCantidadPlataformas, { depth: null, colors: true });

  return {
    zonas: listaAtributosConCantidadPlataformas,
    piezasAdicionales: piezasDetalleAdicionalesEscuadrasConDescuento,
    //piezasDetallePlataformas: piezasDetallePlataformas,
    detalles_escuadras: totalesDetallesEscuadras,
    detalle_plataformas: totalesFormateadosDetallePlataformas,
  };
}

module.exports = {
  generarPdfEscuadrasConPlataformas,
};