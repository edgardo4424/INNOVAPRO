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
    }
  );

  const uso_id = despieceEncontrado.atributos_valors?.[0].atributo.uso_id;
 
  console.log('cotizacionEncontrado', cotizacionEncontrado);
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
      fecha: formatearFechaIsoADMY(cotizacionEncontrado.updatedAt),
      moneda: despieceEncontrado.moneda,
      subtotal_despiece_sin_igv: despieceEncontrado.subtotal,
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
  };

  // Añadir algunos datos particulares para cada uso

  switch (uso_id+"") {
    case "1":
        // ANDAMIO DE FACHADA
    
      break;

    case "2":
         // ANDAMIO DE TRABAJO
      datosPdfCotizacion = {
        ...datosPdfCotizacion,
        cantidad_usos: 1,
        atributos: {
          longitud_mm: despieceEncontrado?.atributos_valors[0]?.valor,
          ancho_mm: despieceEncontrado?.atributos_valors[1]?.valor,
          altura_m: despieceEncontrado?.atributos_valors[2]?.valor,
        },
      };
      break;

    case "3":
        // ESCALERA DE ACCESO
      break;

    case "4":
        // ESCUADRAS
      break;

    case "5":
        // PUNTALES
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
