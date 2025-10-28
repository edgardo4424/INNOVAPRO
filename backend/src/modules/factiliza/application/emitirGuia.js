const { registrarLogFactiliza } = require('../helpers/loggerFactiliza')
const factilizaService = require('../service/factilizaService');
const { determinarEstadoFactura } = require('../helpers/manejoCodigosSunat');

module.exports = async (guia, repository) => {
  try {
    // ? 0 ver si la guia no existe

    const guiaReguistrada = await repository.obtenerGuiaPorInformacion(guia.correlativo, guia.serie, guia.empresa_Ruc, guia.tipo_Doc);
    if (guiaReguistrada?.length > 0) {
      return {
        codigo: 400,
        respuesta: {
          success: false,
          data: guiaReguistrada,
          message: 'eL documento ya se encuentra emitido / registrado',
          status: 400
        },
      };
    }

    // ! 🪵 Registrar las guias enviadas
    registrarLogFactiliza('FRONTEND_REQUEST_GUIA', {
      tipo: 'GUIA',
      serie: guia.serie,
      correlativo: guia.correlativo,
      ruc: guia.empresa_Ruc,
      content: guia,
    });


    // ? 1 Enviar la guía a Factiliza
    const response = await factilizaService.enviarGuia(guia);

    // ! 🪵 Registrar siempre lo que devuelve Factiliza
    registrarLogFactiliza('FACTILIZA_RESPONSE', {
      tipo: 'GUIA',
      serie: guia.serie,
      correlativo: guia.correlativo,
      ruc: guia.empresa_Ruc,
      response,
    });


    const { status, success, message, data } = response || {};

    // ? 2 Validar respuesta HTTP
    if (status !== 200) {
      registrarLogFactiliza('FACTILIZA_ERROR', {
        tipo: 'GUIA',
        serie: guia.serie,
        correlativo: guia.correlativo,
        ruc: guia.empresa_Ruc,
        content: guia,
      })
      return {
        codigo: status || 500,
        respuesta: {
          success: false,
          message: message || 'Error desconocido al emitir la guía.',
          detailed_message:
            data?.error
              ? `${data.error.code} - ${data.error.message}`
              : 'No se obtuvo respuesta válida del servicio.',
          data: null,
          status: status || 500,
        },
      };
    }

    // ? 3 Construir respuesta SUNAT
    const sunat_respuesta = {
      hash: data?.hash ? data.hash : null,
      mensaje: message ? message : null,
      cdr_zip: null, // ⚠️ Ya no se guarda
      sunat_success: data?.sunatResponse?.success ?? null,
      cdr_response_id: data?.sunatResponse?.cdrResponse?.id ?? null,
      cdr_response_code: data?.sunatResponse?.cdrResponse?.code ?? null,
      cdr_response_description:
        data?.sunatResponse?.cdrResponse?.description ?? null,
    };

    // ? 4 Determinar estado final
    const estado = determinarEstadoFactura({ status, success, data, message });

    // ? 5 Estructurar guía completa para BD
    const guiaEstructurada = {
      ...guia,
      estado,
      sunat_respuesta,
    };

    // ? 6 Separar campos antes de guardar
    const { detalle, chofer, transportista, sunat_respuesta: sr, ...guiaBase } =
      guiaEstructurada;

    // ? 7 Guardar en BD
    const resultado = await repository.crear({
      guia: guiaBase,
      detalle,
      sunat_respuesta: sr,
      chofer,
      transportista,
    });

    if (!resultado?.success) {
      registrarLogFactiliza('ERROR_BD_GUIA', {
        tipo: 'GUIA',
        serie: guia.serie,
        correlativo: guia.correlativo,
        mensaje: resultado?.message,
        guiaBase,
      });
      return {
        codigo: 400,
        respuesta: {
          success: false,
          message:
            resultado?.message ||
            'La guía de remisión fue enviada, pero no se pudo registrar en la base de datos.',
          data: null,
          status: 400,
        },
      };
    }

    let messageParaElCliente = message || '';
    let statusParaElCliente = 200;
    if (estado == 'PENDIENTE') {
      messageParaElCliente = 'La guía de remisión fue emitida, pero se encuentra pendiente de autorización en la SUNAT.'
      statusParaElCliente = 200
    } else if (estado == 'RECHAZADA') {
      messageParaElCliente = 'La guía de remisión fue rechazada por la SUNAT, verifique los detalles para obtener mas información.'
      statusParaElCliente = 400
    } else if (estado == 'EMITIDA') {
      messageParaElCliente = 'La guía de remisión fue emitida y registrada correctamente.'
      statusParaElCliente = 201
    }
    // ? 8 Retornar éxito total
    return {
      codigo: 201,
      respuesta: {
        success: true,
        message: messageParaElCliente,
        data: resultado?.data || null,
        status: statusParaElCliente,
      },
    };

  } catch (error) {
    registrarLogFactiliza('EXCEPCION_GUIA', {
      tipo: 'GUIA',
      serie: guia?.serie,
      correlativo: guia?.correlativo,
      message: error?.response?.data?.message || error?.message,
      error_factiliza: error?.response?.data,
      error_full: error,
      content: guia
    });

    // ? 9 Manejo de errores genéricos o de red
    return {
      codigo: 400,
      respuesta: {
        success: false,
        message:
          error?.response?.data?.message ||
          error?.message ||
          'Error interno al emitir la guía de remisión.',
        detailed_message: null,
        error_factiliza: error?.response?.data,
        status: 500,
      },
    };
  }
};
