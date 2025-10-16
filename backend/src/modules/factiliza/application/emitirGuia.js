const factilizaService = require('../service/factilizaService');
const { determinarEstadoFactura } = require('../helpers/manejoCodigosSunat');

module.exports = async (guia, repository) => {
  try {
    // 1️⃣ Enviar la guía a Factiliza
    const response = await factilizaService.enviarGuia(guia);
    const { status, success, message, data } = response || {};

    // 2️⃣ Validar respuesta HTTP
    if (status !== 200) {
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

    // 3️⃣ Construir respuesta SUNAT
    const sunat_respuesta = {
      hash: data?.hash ?? null,
      mensaje: message ?? null,
      cdr_zip: null, // ⚠️ Ya no se guarda
      sunat_success: data?.sunatResponse?.success ?? null,
      cdr_response_id: data?.sunatResponse?.cdrResponse?.id ?? null,
      cdr_response_code: data?.sunatResponse?.cdrResponse?.code ?? null,
      cdr_response_description:
        data?.sunatResponse?.cdrResponse?.description ?? null,
    };

    // 4️⃣ Determinar estado final
    const estado = determinarEstadoFactura({ status, success, data, message });

    // 5️⃣ Estructurar guía completa para BD
    const guiaEstructurada = {
      ...guia,
      estado,
      sunat_respuesta,
    };

    // 6️⃣ Separar campos antes de guardar
    const { detalle, chofer, transportista, sunat_respuesta: sr, ...guiaBase } =
      guiaEstructurada;

    // 7️⃣ Guardar en BD
    const resultado = await repository.crear({
      guia: guiaBase,
      detalle,
      sunat_respuesta: sr,
      chofer,
      transportista,
    });

    if (!resultado?.success) {
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

    // 8️⃣ Retornar éxito total
    return {
      codigo: 201,
      respuesta: {
        success: true,
        message:
          message ||
          'La guía de remisión fue emitida y registrada correctamente.',
        data: resultado?.data || null,
        status: 201,
      },
    };
  } catch (error) {
    console.error('[Error emitirGuia]:', error);

    // 9️⃣ Manejo de errores genéricos o de red
    return {
      codigo: 500,
      respuesta: {
        success: false,
        message:
          error?.response?.data?.message ||
          error?.message ||
          'Error interno al emitir la guía de remisión.',
        detailed_message:
          error?.response?.data?.error ||
          error?.stack?.substring(0, 200) ||
          null,
        data: null,
        status: 500,
      },
    };
  }
};
