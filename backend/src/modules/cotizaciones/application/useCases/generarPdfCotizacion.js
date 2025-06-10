const db = require("../../../../models");
const { formatearFechaIsoADMY } = require("../../infrastructure/helpers/formatearFecha");

module.exports = async (idCotizacion, cotizacionRepository) => {
  // Buscar la cotizacion incluyendo: obra, cliente, contacto, despiece, filial, usuario, costos de cotizacion de transporte
  const cotizacionEncontrado = await db.cotizaciones.findByPk(idCotizacion, {
    include: [
      {
        model: db.obras,
        as: "obra",
      },
      {
        model: db.clientes,
        as: "cliente",
      },
      {
        model: db.contactos,
        as: "contacto",
      },
      {
        model: db.despieces,
        as: "despiece",
      },
      {
        model: db.empresas_proveedoras,
      },
      {
        model: db.usuarios,
        as: "usuario",
      },
      {
        model: db.cotizaciones_transporte,
      },
      {
        model: db.estados_cotizacion
      }
    ],
  });

  if (!cotizacionEncontrado)
    return { codigo: 404, respuesta: { mensaje: "Cotización no encontrada" } };

  // A partir del despiece_id de la cotización, se obtiene los valores de los atributos para generar la cotizacion
  const despieceEncontrado = await db.despieces.findByPk(
    cotizacionEncontrado.despiece_id,
    {
      include: [
        {
          model: db.atributos_valor,
          include: [
            {
              model: db.atributos,
              as: "atributo",
            },
          ],
        },
      ],
    },
  );
  
  if (!despieceEncontrado)
    return { codigo: 404, respuesta: { mensaje: "Despiece no encontrada" } };


  const uso_id = despieceEncontrado.atributos_valors?.[0].atributo.uso_id;

  const usoEncontrado = await db.usos.findByPk(uso_id)

  // Para saber la cantidad de usos
  const ultimoAtributo = despieceEncontrado.atributos_valors[despieceEncontrado.atributos_valors.length - 1];
  const cantidadUso = ultimoAtributo.numero_formulario_uso

  const tipoServicio = cotizacionEncontrado.tipo_cotizacion;
  let tiempoAlquilerDias = null;

  if(tipoServicio=="Alquiler"){
    tiempoAlquilerDias = cotizacionEncontrado?.tiempo_alquiler_dias
  }

  // Mapear los datos generales para todos los usos para generar el pdf
 
  let datosPdfCotizacion = {
    obra: {
      nombre: cotizacionEncontrado.obra.nombre,
      direccion: cotizacionEncontrado.obra.direccion,
    },
    cliente: {
      razon_social: cotizacionEncontrado.cliente.razon_social,
      ruc: cotizacionEncontrado.cliente.ruc,
      domicilio_fiscal: cotizacionEncontrado.cliente.domicilio_fiscal,
    },
    contacto: {
      nombre: cotizacionEncontrado.contacto.nombre,
      correo: cotizacionEncontrado.contacto.email,
    },
    filial: {
      /* ...cotizacionEncontrado?.empresas_proveedora.dataValues, */
      razon_social: cotizacionEncontrado.empresas_proveedora.razon_social,
      ruc: cotizacionEncontrado.empresas_proveedora.ruc,
      direccion: cotizacionEncontrado.empresas_proveedora.direccion,
    },
    usuario: {
      nombre: cotizacionEncontrado.usuario.nombre,
      telefono: cotizacionEncontrado.usuario.telefono,
      correo: cotizacionEncontrado.usuario.email,
    },
    cotizacion: {
      /* codigo_documento: codigoDocumento, */
      fecha: formatearFechaIsoADMY(cotizacionEncontrado.createdAt),
      moneda: despieceEncontrado.moneda,
      subtotal_con_descuento_sin_igv: despieceEncontrado.subtotal_con_descuento,
      tipo_servicio: tipoServicio,
      tiempo_alquiler_dias: tiempoAlquilerDias,
      codigo_documento: cotizacionEncontrado.codigo_documento,
      cp: despieceEncontrado.cp
    },
    tarifa_transporte: {
      /* ...cotizacionEncontrado?.cotizaciones_transportes?.[0]?.dataValues  */
      costo_tarifas_transporte:
        cotizacionEncontrado?.cotizaciones_transportes?.[0]
          ?.costo_tarifas_transporte,
      costo_pernocte_transporte:
        cotizacionEncontrado?.cotizaciones_transportes?.[0]
          ?.costo_pernocte_transporte,
      costo_distrito_transporte:
        cotizacionEncontrado?.cotizaciones_transportes?.[0]
          ?.costo_distrito_transporte,
      costo_total_transporte:
        cotizacionEncontrado?.cotizaciones_transportes?.[0]?.costo_total,
    },
    
    uso: {
      id: usoEncontrado.id,
      nombre: usoEncontrado.descripcion,
      cantidad_uso: cantidadUso,
    }
  };

  const tiene_pernos = despieceEncontrado.tiene_pernos

  // Añadir algunos datos particulares para cada uso

  switch (uso_id+"") {
    case "1":
        // ANDAMIO DE FACHADA
    
      break;

    case "2":

        // ANDAMIO DE TRABAJO

        let pernoExpansionConArgolla;
        let pernoEnElDespiece;

        if(tiene_pernos){
          pernoExpansionConArgolla = await db.piezas.findOne({
            where: {
              item: "CON.0100"
            }
          })

          pernoEnElDespiece = await db.despieces_detalle.findOne({
            where: {
              despiece_id: despieceEncontrado.id,
              pieza_id: pernoExpansionConArgolla.id
            },
          })
        }

        datosPdfCotizacion = {
            ...datosPdfCotizacion,
            atributos: {
              longitud_mm: Number(despieceEncontrado?.atributos_valors?.[0]?.valor)/1000 || "",
              ancho_mm: Number(despieceEncontrado?.atributos_valors?.[1]?.valor)/1000 || "",
              altura_m: despieceEncontrado?.atributos_valors?.[2]?.valor || "",
              tiene_pernos: tiene_pernos,
              nombre_perno_expansion: tiene_pernos ? pernoExpansionConArgolla.descripcion : null,
              precio_perno_expansion: tiene_pernos ? (Number(pernoExpansionConArgolla.precio_venta_soles)*Number(pernoEnElDespiece.cantidad)).toFixed(2) : null,
              cantidad_pernos_expansion: tiene_pernos ? pernoEnElDespiece.cantidad : null,
            },
        };
        break;

    case "3":

        // ESCALERA DE ACCESO
        const  tipoAnclaje = despieceEncontrado.atributos_valors?.[4]?.valor;
        let itemPiezaVenta;

        if(tipoAnclaje=="FERMIN"){
          itemPiezaVenta = "CON.0200"
        }else{
          itemPiezaVenta = "CON.0100"
        }

        //const tiene_pernos = despieceEncontrado.tiene_pernos

        let pernoExpansionArgolla;
        let pernoDespiece;

        if(tiene_pernos){
          
         pernoExpansionArgolla = await db.piezas.findOne({
        where: {
          item: itemPiezaVenta
        }
        })

        pernoDespiece = await db.despieces_detalle.findOne({
        where: {
          despiece_id: despieceEncontrado.id,
          pieza_id: pernoExpansionArgolla.id
        },
        })

        }

        const tipoEscalera = despieceEncontrado.atributos_valors?.[2]?.valor;

        let longitud_mm;

        if(tipoEscalera=="EUROPEA"){
          longitud_mm = 2072 / 1000;
        }else{
          longitud_mm = 3072 / 1000;
        }

        let ancho_mm = 1572 / 1000;

       datosPdfCotizacion = {
        ...datosPdfCotizacion,
        atributos: {
          longitud_mm: longitud_mm,
          ancho_mm: ancho_mm,
          altura_m: despieceEncontrado.atributos_valors?.[0]?.valor,

          nombre_pernos_expansion: tiene_pernos ? pernoExpansionArgolla.descripcion : null,
          precio_pernos_expansion: tiene_pernos ? pernoExpansionArgolla.precio_venta_soles : null,
          cantidad_pernos_expansion: tiene_pernos ? pernoDespiece.cantidad : null,
        }
       }

      break;

    case "4":
        // ESCUADRAS
      break;

    case "5":

     // PUNTALES

    let piezaVentaPinPresion;

     let piezaVentaArgolla;
   
     const tipoPuntal = despieceEncontrado?.atributos_valors?.[1]?.valor;

      if(tipoPuntal=="5m"){
        piezaVentaPinPresion = "PU.0800"
          piezaVentaArgolla = "PU.1000"
          
        }else{
          piezaVentaPinPresion = "PU.0700"
          piezaVentaArgolla = "PU.0900"
        }

     

      const piezaArgolla = await db.piezas.findOne({
        where: {
          item: piezaVentaArgolla
        }
      })

      const piezaPIN = await db.piezas.findOne({
        where: {
          item: piezaVentaPinPresion
        }
      })

      datosPdfCotizacion = {
        ...datosPdfCotizacion,
        atributos: {
          cantidad: despieceEncontrado?.atributos_valors?.[0]?.valor || "",
          tipoPuntal: despieceEncontrado?.atributos_valors?.[1]?.valor || "",
          tripode: despieceEncontrado?.atributos_valors?.[2]?.valor || "",

          precio_argolla: piezaArgolla.precio_venta_soles,
          precio_pasador: piezaPIN.precio_venta_soles
        },
      };
        
      break;
    
    case "6":
        // ENCOFRADO
      break;
    
    case "7":
        // PLATAFORMAS DE DESCARGA
      break;
    
    case "8":
        // COLGANTE
      break;
    
    case "9":
        // ELEVADOR
      break;

    default:
      break;
  }

  return { codigo: 200, respuesta: datosPdfCotizacion };
};