const {
  mapearDataColgante,
} = require("../../infraestructure/services/Colgante/mapearDataColgante");
const db = require("../../../../database/models"); // Llamamos los modelos sequelize de la base de datos
const {
  mapearDataAndamioFachada,
} = require("../../infraestructure/services/AndamioFachada/mapearDataAndamioFachada");
const {
  mapearDataAndamioTrabajo,
} = require("../../infraestructure/services/AndamioTrabajo/mapearDataAndamioTrabajo");
const {
  mapearDataEscaleraAcceso,
} = require("../../infraestructure/services/EscaleraAcceso/mapearDataEscaleraAcceso");
const {
  mapearDataEscuadrasConPlataformas,
} = require("../../infraestructure/services/EscuadrasConPlataformas/mapearDataEscuadrasConPlataformas");
const moment = require("moment");

module.exports = async (
  contrato_id,
  contratoRepository,
  transaction = null
) => {
  const contratoEncontrado = await db.contratos.findOne(
    {
      where: { id: contrato_id },
      include: [
        {
          model: db.obras,
          as: "obra",
        },
        {
          model: db.empresas_proveedoras,
          as: "filial",
        },
        {
          model: db.clientes,
          as: "cliente",
        },
        {
          model: db.usuarios,
          as: "usuario",
          include: [
            {
              model: db.trabajadores,
              as: "trabajador",
            },
          ],
        },
        {
          model: db.contactos,
          as: "contacto",
        },
      ],
    },
    { transaction }
  );

  const contrato = contratoEncontrado.get({ plain: true });

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

  // obtener datos del contrato
  const fechaInicioContrato = contrato.fecha_inicio;

  const diaFechaInicioContrato = moment(fechaInicioContrato).date();
  const mesFechaInicioContrato =
    moment(fechaInicioContrato).format("MMMM").charAt(0).toUpperCase() +
    moment(fechaInicioContrato).format("MMMM").slice(1); // Mes en formato texto capitalizado
  const anioFechaInicioContrato = moment(fechaInicioContrato).year();


  //Obteniendo la informacion de detalles Piezas adicionales
  const piezas_adicionales = pdfCotizacionDataSnapshot.piezasAdicionales || [];
  const cantidad_total_piezas_adicionales = piezas_adicionales.reduce(
    (total, pieza) => total + (pieza.cantidad || 0),
    0
  ) || 0;

  const precio_alquiler_soles_total_piezas_adicionales =
    piezas_adicionales.reduce(
      (total, pieza) => total + (pieza.precio_alquiler_soles || 0),
      0
    ) || 0;

  // Obteniendo la informacion de instalacion

  const tiene_instalacion = pdfCotizacionDataSnapshot?.instalacion?.tiene_instalacion ? pdfCotizacionDataSnapshot?.instalacion?.tiene_instalacion : false;
  const tiene_transporte = Object.keys(pdfCotizacionDataSnapshot?.tarifa_transporte || {}).length > 0 ? true : false;

  let respuesta = {
    activadores: {
      //Usos
      esAE: false, //Es COLGANTE (Andamio Electrico)
      esAF: false, //Es ANDAMIO DE FACHADA
      esAT: false, //Es ANDAMIO DE TRABAJO
      esEA: false, //Es ESCALERA DE ACCESO
      esEC: false, //Es ESCUADRA CON PLATAFORMAS
      esPD: false, //Es PLATAFORMA DE DESCARGA
      esPU: false, //Es PUNTALES

      // Detalles opcionales
      tienePlataformas: false,
      tienePernosSinArgolla: false,
      tienePernosArgolla: false,
      tienePuntales: false,
      tienePiezasAdicionales: piezas_adicionales.length > 0 ? true : false,
      tieneInstalacion: tiene_instalacion,
      tieneInstalacionParcial: pdfCotizacionDataSnapshot?.instalacion?.tipo_instalacion == "Parcial" ? true : false,
      tieneTransporte: tiene_transporte,

      // Condiciones de alquiler
      mostrarCondiciones: true,
      tienePagoAdelantado: true,
      tieneGarantia: true,
      tieneDepositoEnGarantia: true,
      tieneOrdenDeServicio: true,
      tieneLetra: true,
      tieneCheque: true,
    },
    uso: pdfCotizacionDataSnapshot.uso,
    obra: {
      nombre: contrato.obra.nombre,
      direccion: contrato.obra.direccion,
    },
    filial: {
      ruc: contrato.filial.ruc,
      razon_social: contrato.filial.razon_social,
      direccion: contrato.filial.direccion,
    },
    cliente: {
      tipo: contrato.cliente.tipo,
      ruc:
        contrato.cliente.tipo == "Persona Natural"
          ? contrato.cliente.dni
          : contrato.cliente.ruc,
      razon_social: contrato.cliente.razon_social, // asi sea Persona Natural o Jurídica
      domicilio_fiscal: contrato.cliente.domicilio_fiscal,
      representante_legal:
        contrato.cliente.tipo == "Persona Natural"
          ? contrato.cliente.razon_social
          : contrato.cliente.representante_legal,
      numero_documento_representante:
        contrato.cliente.tipo == "Persona Natural"
          ? contrato.cliente.dni
          : contrato.cliente.dni_representante,
      cargo_representante_legal: contrato.cliente.cargo_representante,
      domicilio_representante: contrato.cliente.domicilio_representante,
    },
    comercial: {
      correo: contrato.usuario.correo,
      nombre: contrato.usuario.trabajador.nombres,
      apellido: contrato.usuario.trabajador.apellidos,
      telefono: contrato.usuario.trabajador.telefono,
    },
    contacto: {
      nombre: contrato.contacto.nombre,
      correo: contrato.contacto.email,
    },
    fecha: {
      dia: diaFechaInicioContrato,
      mes: mesFechaInicioContrato,
      anio: anioFechaInicioContrato,
    },
    cotizacion: pdfCotizacionDataSnapshot.cotizacion,
    contrato: {
      codigo: contrato.ref_contrato,
    },

    //! USOS
    usos: {
      AF: {}, // Es Andamio de Fachada
      AT: {}, // Es Andamio de Trabajo
      EA: {}, // Es Escalera de Acceso
      EC: {}, // Es Escuadra con Plataforma
      PD: {}, // Es Plataforma de Descarga
      PU: {}, // Es Puntales
    },

    detalles_piezasAdicionales: {
      piezasAdicionales: piezas_adicionales,
      cantidad_total: cantidad_total_piezas_adicionales,
      precio_alquiler_soles_total:
        precio_alquiler_soles_total_piezas_adicionales,
    },

    instalacion: tiene_instalacion ? pdfCotizacionDataSnapshot?.instalacion : {},

    tarifa_transporte: tiene_transporte ? pdfCotizacionDataSnapshot?.tarifa_transporte : {},

    perno_expansion_sin_argolla: {},
    perno_expansion_con_argolla: {},
    detalles_puntales: {},
  };

  // Verificar por switch el uso de contrato,
  switch (contrato.uso_id + "") {
    case "1":
      // Anadamio de fachada
      respuesta.activadores.esAF = true;
      respuesta = mapearDataAndamioFachada({
        pdfCotizacionDataSnapshot,
        respuesta,
      });
      break;
    case "2":
      // Andamio de trabajo
      respuesta.activadores.esAT = true;
      respuesta = mapearDataAndamioTrabajo({
        pdfCotizacionDataSnapshot,
        respuesta,
      });
      break;
    case "3":
      // Escalera de acceso
      respuesta.activadores.esEA = true;
      respuesta = mapearDataEscaleraAcceso({
        pdfCotizacionDataSnapshot,
        respuesta,
      });
      break;
    case "4":
      // Escuadras con plataforma
      respuesta.activadores.esEC = true;
      respuesta = mapearDataEscuadrasConPlataformas({
        pdfCotizacionDataSnapshot,
        respuesta,
      });
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
      respuesta = mapearDataColgante({ pdfCotizacionDataSnapshot, respuesta });
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
