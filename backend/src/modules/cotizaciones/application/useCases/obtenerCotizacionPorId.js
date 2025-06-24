const db = require("../../../../models");
const {
  mapearPorAtributos,
  agruparPorZonaYAtributos,
} = require("../../infrastructure/services/mapearAtributosDelPdfService");
const {
  mapearAtributosValor,
} = require("../../infrastructure/services/mapearAtributosValorService");

module.exports = async (id, cotizacionRepository) => {
  const cotizacion = await db.cotizaciones.findByPk(id, {
    include: [
        {
            model: db.contactos,
            as: "contacto"
        },
         {
            model: db.clientes,
            as: "cliente"
        },
        {
            model: db.obras,
            as: "obra"
        },
        {
            model: db.empresas_proveedoras
        }
    ]
  }); 

  if (!cotizacion)
    return { codigo: 404, respuesta: { mensaje: "Cotizacion no encontrado" } }; // Si no se encuentra el cotizacion, retorna un error 404

  // Obtener la lista de atributos

  const atributosDelUso = await db.atributos_valor.findAll({
    where: {
      despiece_id: cotizacion.despiece_id,
    },
    include: [
      {
        model: db.atributos,
        as: "atributo",
      },
    ],
  });

  const resultado = mapearAtributosValor(atributosDelUso);

  const listaAtributos = agruparPorZonaYAtributos(resultado);

  const listaAtributosFormateado = listaAtributos.map((atributo) => ({
    zona: atributo.zona,
    atributos_formulario: atributo.atributos,
    nota_zona: atributo.atributos[0].nota_zona,
  }));

  // Obtener despiece
  const despieceDetalle = await db.despieces_detalle.findAll({
    where: {
      despiece_id: cotizacion.despiece_id,
    },
    include: [
      {
        model: db.piezas,
        as: "pieza",
      },
    ],
  });

  const despieceFormateado = despieceDetalle.map((pieza) => ({
    pieza_id: pieza.pieza_id,
    item: pieza.pieza.item,
    descripcion: pieza.pieza.descripcion,
    total: pieza.cantidad,
    peso_u_kg: pieza.pieza.peso_kg,
    peso_kg: pieza.peso_kg,
    precio_u_venta_dolares: (pieza.precio_venta_dolares/pieza.cantidad).toFixed(2),
    precio_venta_dolares: pieza.precio_venta_dolares,
    precio_u_venta_soles: (pieza.precio_venta_soles/pieza.cantidad).toFixed(2),
    precio_venta_soles: pieza.precio_venta_soles,
    precio_u_alquiler_soles: (pieza.precio_alquiler_soles/pieza.cantidad).toFixed(2),
    precio_alquiler_soles: pieza.precio_alquiler_soles,
    stock_actual: pieza.pieza.stock_actual,
  }));

  // Obtener cotizacion

  const dataCotizacion = {
    contacto_id: cotizacion.contacto_id,
    contacto_nombre: cotizacion.contacto.nombre,
    cliente_id: cotizacion.cliente_id,
    cliente_razon_social: cotizacion.cliente.razon_social,
    obra_id: cotizacion.obra_id,
    obra_nombre: cotizacion.obra.nombre,
    filial_id: cotizacion.filial_id,
    filial_razon_social: cotizacion.empresas_proveedora.razon_social,
    tipo_cotizacion: cotizacion.tipo_cotizacion,
    porcentaje_descuento: cotizacion.porcentaje_descuento,
    tiempo_alquiler_dias: cotizacion.tiempo_alquiler_dias,
    igv_porcentaje: cotizacion.igv_porcentaje,
  };

  const respuesta = {
    uso_id: cotizacion.uso_id,
    zonas: listaAtributosFormateado,
    despiece: despieceFormateado,
    cotizacion: dataCotizacion,
  };
  return { codigo: 200, respuesta: respuesta }; // Retorna el cotizacion encontrado
}; // Exporta la función para que pueda ser utilizada en otros módulos
