const {
  mapearDataColgante
} = require("../../infraestructure/services/Colgante/mapearDataColgante");
const db = require("../../../../database/models"); // Llamamos los modelos sequelize de la base de datos

module.exports = async (
  contrato_id,
  contratoRepository,
  transaction = null
) => {
  const contrato = await contratoRepository.obtenerPorId(
    contrato_id,
    transaction
  ); // Llama al método del repositorio para obtener el contrato por ID

  console.log("contrato", contrato);
  if (!contrato) {
    return {
      codigo: 404,
      respuesta: { error: "Contrato no encontrado" },
    };
  }

  // Obtener toda el pdf_cotizacion_data_snapshot de la cotización asociada al contrato

  const cotizacion = await db.cotizaciones.findOne({
    where: { id: contrato.cotizacion_id },
    attributes: ["pdf_cotizacion_data_snapshot"],
    transaction,
  });

  if (!cotizacion || !cotizacion.pdf_cotizacion_data_snapshot) {
    return {
      codigo: 404,
      respuesta: { error: "Datos de cotización para PDF no encontrados" },
    };
  }

  const pdf_cotizacion_snapshot = cotizacion.pdf_cotizacion_data_snapshot;

  let pdfCotizacionDataSnapshot = pdf_cotizacion_snapshot;

  try {
    if (
      typeof pdfCotizacionDataSnapshot === "string" &&
      pdfCotizacionDataSnapshot.trim() !== ""
    ) {
      pdfCotizacionDataSnapshot = JSON.parse(pdfCotizacionDataSnapshot);
    }
  } catch (e) {
    console.error("Error al parsear pdfCotizacionDataSnapshot:", e);
    pdfCotizacionDataSnapshot = {};
  }

  console.log('pdfCotizacionDataSnapshot', pdfCotizacionDataSnapshot);

  let respuesta = {
    activadores: {
      esAE: false, //Es COLGANTE (Andamio Electrico)
      esAF: false,
    },
    uso: pdfCotizacionDataSnapshot.uso,
    obra: pdfCotizacionDataSnapshot.obra,
    filial: pdfCotizacionDataSnapshot.filial,
    cliente: pdfCotizacionDataSnapshot.cliente,
    usuario: pdfCotizacionDataSnapshot.usuario,
    contacto: pdfCotizacionDataSnapshot.contacto,
    cotizacion: pdfCotizacionDataSnapshot.cotizacion,
    instalacion: {
        tiene_instalacion: pdfCotizacionDataSnapshot.instalacion?.tiene_instalacion || false,
        data: pdfCotizacionDataSnapshot.instalacion?.tiene_instalacion ? {
            ...pdfCotizacionDataSnapshot.instalacion
        } : {}
    },
    piezasAdicionales: {
        tiene_piezas_adicionales: pdfCotizacionDataSnapshot.piezasAdicionales.length > 0 ? true : false,
        data: pdfCotizacionDataSnapshot.piezasAdicionales || []
    },
    transporte: {
        tiene_transporte: pdfCotizacionDataSnapshot?.tarifa_transporte && Object.keys(pdfCotizacionDataSnapshot?.tarifa_transporte).length > 0 ? true : false,
        data: {
            ...pdfCotizacionDataSnapshot?.tarifa_transporte
        }
    }

  };

  // Verificar por switch el uso de contrato,
  switch (contrato.uso_id + "") {
    case "1":
      // Anadamio de fachada
      break;
    case "2":
      // Andamio de trabajo
      break;
    case "3":
      // Escalera de acceso
      break;
    case "4":
      // Escuadras con plataforma
      break;
    case "5":
      // Puntales
      break;
    case "6":
      // Encofrado
      break;
    case "7":
      // Plataformas de descarga
      break;
    case "8":
      // Colgante
      respuesta.activadores.esAE = true;
      respuesta = mapearDataColgante({ pdfCotizacionDataSnapshot, contrato, respuesta });
      break;
    case "9":
      // Elevador
      break;
    case "10":
      // Despiece manual
      break;
    case "11":
      // Escuadras sin plataforma
      break;
    default:
      break;
  }

  return {
    codigo: 200,
    respuesta: respuesta,
  };
};
