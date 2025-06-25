const db = require("../../../../models");
const {
  agruparPorZonaYAtributos,
  agruparPorZona,
} = require("../../infrastructure/services/mapearAtributosDelPdfService");
const {
  mapearAtributosValor,
} = require("../../infrastructure/services/mapearAtributosValorService");


const ID_ESTADO_COTIZACION_DESPIECE_GENERADO = 2;

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
        },
        {
          model: db.usos,
          as: "uso"
        }
    ]
  }); 

  if (!cotizacion)
    return { codigo: 404, respuesta: { mensaje: "Cotizacion no encontrado" } }; // Si no se encuentra el cotizacion, retorna un error 404

   // Obtener la lista de atributos
  
    let atributosDelUso = [];
  
    if(cotizacion.estados_cotizacion_id == ID_ESTADO_COTIZACION_DESPIECE_GENERADO){
      const tareaEncontrada = await db.tareas.findOne({
        where: {
          cotizacionId: cotizacion.id
        }
      });
      console.log('tareaEncontrada', tareaEncontrada);
  
      atributosDelUso = tareaEncontrada?.atributos_valor_zonas || []
  
    }else{
  
     // Obtener la lista de atributos
    
           const atributosValorBD = await db.atributos_valor.findAll({
            where: {
              despiece_id: cotizacion.despiece_id,
            },
            include: [
              {
                model: db.atributos,
                as: "atributo",
              }
            ]
          });
    
      const resultado = mapearAtributosValor(atributosValorBD);
  
      const listaAtributos = agruparPorZona(resultado);

      atributosDelUso = listaAtributos.map((atributo) => (({
        zona: atributo.zona,
         nota_zona: atributo.atributos[0].nota_zona,
        atributos_formulario: atributo.atributos.map((at) => (({
          ...at
        }))),
       
      })))
    }

  console.log('atributosDelUso', atributosDelUso);

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
    obra_direccion: cotizacion.obra.direccion,
    filial_id: cotizacion.filial_id,
    filial_razon_social: cotizacion.empresas_proveedora.razon_social,
    tipo_cotizacion: cotizacion.tipo_cotizacion,
    porcentaje_descuento: cotizacion.porcentaje_descuento,
    tiempo_alquiler_dias: cotizacion.tiempo_alquiler_dias,
    igv_porcentaje: cotizacion.igv_porcentaje,
  };

  const respuesta = {
    uso_id: cotizacion.uso_id,
    uso_nombre: cotizacion.uso.descripcion,
    zonas: atributosDelUso,
    despiece: despieceFormateado,
    cotizacion: dataCotizacion,
  };

  console.log('respuesta', respuesta);
  
  return { codigo: 200, respuesta: respuesta }; // Retorna el cotizacion encontrado
}; // Exporta la función para que pueda ser utilizada en otros módulos
