const db = require("../../../../database/models"); // Llamamos los modelos sequelize de la base de datos
const {
  formatearFechaIsoADMY,
} = require("../../infrastructure/helpers/formatearFecha");
const { generarPdfAndamioFachada } = require("../../infrastructure/services/AndamioFachada/generarPdfAndamioFachada");
const { generarPdfAndamioTrabajo } = require("../../infrastructure/services/AndamioTrabajo/generarPdfAndamioTrabajo");
const { calcularSubtotalConDescuentoPiezasNoAdicionales } = require("../../infrastructure/services/calcularSubtotalConDescuentoPiezasNoAdicionalesService");
const { generarPdfColgante } = require("../../infrastructure/services/Colgante/generarPdfColgante");
const { generarPdfEscaleraAcceso } = require("../../infrastructure/services/EscaleraAcceso/generarPdfEscaleraAcceso");
const { generarPdfEscuadrasConPlataformas } = require("../../infrastructure/services/EscuadrasConPlataformas/generarPdfEscuadrasConPlataformas");
const { generarPdfEscuadrasSinPlataformas } = require("../../infrastructure/services/EscuadrasSinPlataformas/generarPdfEscuadrasSinPlataformas");

const {
  agruparPorZonaYAtributos,
} = require("../../infrastructure/services/mapearAtributosDelPdfService");

const {
  mapearAtributosValor,
} = require("../../infrastructure/services/mapearAtributosValorService");
const { generarPdfPlataformaDescarga } = require("../../infrastructure/services/PlataformaDescarga/generarPdfPlataformaDescarga");
const { generarPdfPuntales } = require("../../infrastructure/services/Puntales/generarPdfPuntales");

module.exports = async (idCotizacion) => {

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
        include: 
          [{
            model: db.trabajadores,
            as: "trabajador",
          }]
      },
      {
        model: db.cotizaciones_transporte,
      },
      {
        model: db.estados_cotizacion,
      },
      {
        model: db.usos,
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

  if (!despieceEncontrado)
    return { codigo: 404, respuesta: { mensaje: "Despiece no encontrada" } };

  /* const uso_id = despieceEncontrado.atributos_valors?.[0].atributo.uso_id; */
  const uso_id = cotizacionEncontrado.uso_id;

  const usoEncontrado = await db.usos.findByPk(uso_id);

  const tipoServicio = cotizacionEncontrado.tipo_cotizacion;
  let tiempoAlquilerDias = null;

  if (tipoServicio == "Alquiler") {
    tiempoAlquilerDias = cotizacionEncontrado?.tiempo_alquiler_dias;
  }

  const tiene_pernos = despieceEncontrado.tiene_pernos;

  const instalacionEncontrada = await db.cotizaciones_instalacion.findOne({
    where: {
      cotizacion_id: cotizacionEncontrado.id,
    },
  });

  // Calcular el subtotal sin igv de las piezas que NO SON ADICIONALES
   const piezasNoAdicionales = await db.despieces_detalle.findAll({
    where: {
      esAdicional: false,
      despiece_id: despieceEncontrado.id
    },
    raw: true
   }) || []

   const { subtotal_piezas_no_adicionales_con_descuento_sin_igv } = calcularSubtotalConDescuentoPiezasNoAdicionales({
    despiecePiezasNoAdicionales: piezasNoAdicionales,
    tipoCotizacion: tipoServicio,
    cotizacion: despieceEncontrado,
    uso_id: uso_id,
   } )

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
      razon_social: cotizacionEncontrado.empresas_proveedora.razon_social,
      ruc: cotizacionEncontrado.empresas_proveedora.ruc,
      direccion: cotizacionEncontrado.empresas_proveedora.direccion,
    },
    usuario: {
      nombre: cotizacionEncontrado.usuario.trabajador.nombres + " " + cotizacionEncontrado.usuario.trabajador.apellidos,
      telefono: cotizacionEncontrado.usuario.trabajador.telefono,
      correo: cotizacionEncontrado.usuario.email,
    },
    cotizacion: {
      fecha: formatearFechaIsoADMY(cotizacionEncontrado.updatedAt),
      moneda: despieceEncontrado.moneda,
      subtotal_con_descuento_sin_igv: subtotal_piezas_no_adicionales_con_descuento_sin_igv,
      tipo_servicio: tipoServicio,
      tiempo_alquiler_dias: tiempoAlquilerDias,
      codigo_documento: cotizacionEncontrado.codigo_documento,
      cp: despieceEncontrado.cp,
    },
    tarifa_transporte: {
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
      //cantidad_uso: cantidadUso,
    },

    instalacion: {
      tiene_instalacion: cotizacionEncontrado?.tiene_instalacion,
      tipo_instalacion: instalacionEncontrada?.tipo_instalacion,
      precio_instalacion_completa_soles:
        instalacionEncontrada?.precio_instalacion_completa_soles,
      precio_instalacion_parcial_soles:
        instalacionEncontrada?.precio_instalacion_parcial_soles,
      nota: instalacionEncontrada?.nota,
    },
  };

  // Añadir algunos datos particulares para cada uso

  switch (uso_id + "") {
    case "1":
      // ANDAMIO DE FACHADA

      const pdfAndamioFachada = await generarPdfAndamioFachada({dataDespiece: despieceEncontrado, tiene_pernos: tiene_pernos, porcentajeDescuento: despieceEncontrado.porcentaje_descuento})

      datosPdfCotizacion = {
        ...datosPdfCotizacion,
        ...pdfAndamioFachada
      }

      break;

    case "2":
      // ANDAMIO DE TRABAJO

      const pdfAndamioTrabajo = await generarPdfAndamioTrabajo({idDespiece: despieceEncontrado.id, tiene_pernos: tiene_pernos, porcentajeDescuento: despieceEncontrado.porcentaje_descuento})

      datosPdfCotizacion = {
        ...datosPdfCotizacion,
        ...pdfAndamioTrabajo
      }
     
      break;

    case "3":
      // ESCALERA DE ACCESO

      const pdfEscaleraAcceso = await generarPdfEscaleraAcceso({dataDespiece: despieceEncontrado, tiene_pernos: tiene_pernos, porcentajeDescuento: despieceEncontrado.porcentaje_descuento})

      datosPdfCotizacion = {
        ...datosPdfCotizacion,
        ...pdfEscaleraAcceso,
      };

      break;

    case "4":
      // ESCUADRAS CON PLATAFORMAS

      const pdfEscuadrasConPlataformas = await generarPdfEscuadrasConPlataformas({idDespiece: despieceEncontrado.id, porcentajeDescuento: despieceEncontrado.porcentaje_descuento})

      datosPdfCotizacion = {
        ...datosPdfCotizacion,
        ...pdfEscuadrasConPlataformas
      }
      break;

    case "5":
      // PUNTALES

       const pdfPuntales = await generarPdfPuntales({idDespiece: despieceEncontrado.id, tipo_cotizacion: cotizacionEncontrado.tipo_cotizacion, porcentajeDescuento: despieceEncontrado.porcentaje_descuento})

      datosPdfCotizacion = {
        ...datosPdfCotizacion,
        ...pdfPuntales
      }
      break;

    case "6":
      // ENCOFRADO
      break;

    case "7":
      // PLATAFORMAS DE DESCARGA

      const pdfPlataformaDescarga = await generarPdfPlataformaDescarga({idDespiece: despieceEncontrado.id, porcentajeDescuento: despieceEncontrado.porcentaje_descuento})

      datosPdfCotizacion = {
        ...datosPdfCotizacion,
        ...pdfPlataformaDescarga
      }
      break;

    case "8":
      // COLGANTE

       const pdfColgante = await generarPdfColgante({dataDespiece: despieceEncontrado, idDespiece: despieceEncontrado.id, porcentajeDescuento: despieceEncontrado.porcentaje_descuento})

      datosPdfCotizacion = {
        ...datosPdfCotizacion,
        ...pdfColgante
      }

      break;

    case "9":
      // ELEVADOR
      break;

    case "11":
       // ESCUADRAS SIN PLATAFORMAS

      const pdfEscuadrasSinPlataformas = await generarPdfEscuadrasSinPlataformas({idDespiece: despieceEncontrado.id, porcentajeDescuento: despieceEncontrado.porcentaje_descuento})

      datosPdfCotizacion = {
        ...datosPdfCotizacion,
        ...pdfEscuadrasSinPlataformas
      }
      break;
      break;

    default:
      break;
  }

  return { codigo: 200, respuesta: datosPdfCotizacion };
};
