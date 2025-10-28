const { registrarLogFactiliza } = require('../helpers/loggerFactiliza')
const factilizaService = require('../service/factilizaService');
const { determinarEstadoFactura } = require('../helpers/manejoCodigosSunat');
const { procesarItem } = require('../helpers/procesarItem');

module.exports = async (factura, repository, borradorRepository) => {
    try {
        const facturaRegistrada = await repository.obtenerFacturaPorInformacion(factura.correlativo, factura.serie, factura.empresa_Ruc, factura.tipo_Doc);
        if (facturaRegistrada?.length > 0) {
            return {
                codigo: 400,
                respuesta: {
                    success: false,
                    data: facturaRegistrada,
                    message: 'eL documento ya se encuentra emitido / registrado',
                    status: 400
                },
            };
        }

        // ? 1 Enviar la factura a Factiliza
        const response = await factilizaService.enviarFactura(factura);

        // ! 🪵 Registrar siempre lo que devuelve Factiliza
        registrarLogFactiliza('FACTILIZA_RESPONSE', {
            tipo: factura.tipo_Doc === '01' ? 'FACTURA' : 'BOLETA',
            serie: factura.serie,
            correlativo: factura.correlativo,
            ruc: factura.empresa_Ruc,
            response,
            content: factura,
        });

        const { status, success, message, data } = response || {};

        // ? 2 Validar respuesta HTTP
        if (status !== 200) {
            registrarLogFactiliza('FACTILIZA_ERROR', {
                tipo: factura.tipo_Doc === '01' ? 'FACTURA' : 'BOLETA',
                serie: factura.serie,
                correlativo: factura.correlativo,
                ruc: factura.empresa_Ruc,
                content: factura,
            })
            return {
                codigo: status || 500,
                respuesta: {
                    success: false,
                    message: message || 'Error desconocido al emitir la factura.',
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

        // ? 5 Juntar el resultado 
        const facturaEstructurada = {
            ...factura,
            estado,
            cuotas_Real: factura.cuotas_Real ? JSON.stringify(factura.cuotas_Real) : null,
            relDocs: factura.relDocs ? JSON.stringify(factura.relDocs) : null,
        }

        // ? 6 estructurar para la bd
        const { detalle = [], forma_pago = [], legend = [], id_borrador, ...facturaData } = facturaEstructurada;

        // ? 7 Guardar en la BD
        const resultado = await repository.crear({
            factura: facturaData,
            detalle: detalle,
            formas_pagos: forma_pago,
            leyendas: legend,
            sunat_respuesta: sunat_respuesta,
        });

        if (!resultado?.success) {
            registrarLogFactiliza('ERROR_BD_FACTURA', {
                tipo: factura.tipo_Doc === '01' ? 'FACTURA' : 'BOLETA',
                serie: factura.serie,
                correlativo: factura.correlativo,
                ruc: factura.empresa_Ruc,
                mensaje: resultado?.message,
                content: facturaEstructurada,
                sunat: sunat_respuesta
            });
            return {
                codigo: 400,
                respuesta: {
                    success: false,
                    message:
                        resultado?.message ||
                        'La factura fue enviada, pero no se pudo registrar en la base de datos.',
                    data: null,
                    status: 400,
                },
            };
        }
        let messageParaElCliente = message || '';
        let statusParaElCliente = 200;
        if (estado == 'PENDIENTE') {
            messageParaElCliente = 'La factura fue emitida, pero se encuentra pendiente de autorización en la SUNAT.'
            statusParaElCliente = 200
        } else if (estado == 'RECHAZADA') {
            messageParaElCliente = 'La factura fue rechazada por la SUNAT, verifique los detalles para obtener mas información.'
            statusParaElCliente = 400
        } else if (estado == 'EMITIDA') {
            messageParaElCliente = 'La factura fue emitida y registrada correctamente.'
            statusParaElCliente = 201
        }

        if (id_borrador) {
            await borradorRepository.eliminar(id_borrador);
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
        registrarLogFactiliza('EXCEPTION_FACTURA', {
            tipo: factura?.tipo_Doc === '01' ? 'FACTURA' : 'BOLETA',
            serie: factura?.serie,
            correlativo: factura?.correlativo,
            message: error?.response?.data?.message || error?.message,
            error_factiliza: error?.response?.data,
            content: factura
        });
        // ? 9 Manejo de errores genéricos o de red
        return {
            codigo: 400,
            respuesta: {
                success: false,
                message:
                    error?.response?.data?.message ||
                    error?.message ||
                    'Error interno al emitir la factura.',
                detailed_message: null,
                error_factiliza: error?.response?.data,
                status: 500,
            },
        };
    }
}