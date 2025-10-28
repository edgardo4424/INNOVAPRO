const { registrarLogFactiliza } = require('../helpers/loggerFactiliza')
const factilizaService = require('../service/factilizaService');
const { determinarEstadoFactura } = require('../helpers/manejoCodigosSunat');

module.exports = async (nota, repository, borradorRepository) => {
    try {
        const notaRegistrada = await repository.obtenerNotaDetallada(nota.correlativo, nota.serie, nota.empresa_Ruc, nota.tipo_Doc);

        if (notaRegistrada?.length > 0) {
            return {
                codigo: 400,
                respuesta: {
                    success: false,
                    data: notaRegistrada,
                    message: 'eL documento ya se encuentra emitido / registrado',
                    status: 400
                },
            };
        }
        // ! 🪵 Registrar lo enviado por el frontend
        registrarLogFactiliza('FRONTEND_REQUEST_NOTA', {
            tipo: nota.tipo_Doc == '07' ? 'CREDITO' : 'DEBITO',
            serie: nota.serie,
            correlativo: nota.correlativo,
            ruc: nota.empresa_Ruc,
            content: nota,
        });

        // ? 1 Enviar la nota a Factiliza
        const response = await factilizaService.enviarNota(nota);

        // ! 🪵 Registrar siempre lo que devuelve Factiliza
        registrarLogFactiliza('FACTILIZA_RESPONSE', {
            tipo: nota.tipo_Doc == '07' ? 'CREDITO' : 'DEBITO',
            serie: nota.serie,
            correlativo: nota.correlativo,
            ruc: nota.empresa_Ruc,
            response,
        });

        const { status, success, message, data } = response || {};

        // ? 2 Validar respuesta HTTP
        if (status !== 200) {
            registrarLogFactiliza('FACTILIZA_ERROR', {
                tipo: nota.tipo_Doc == '07' ? 'CREDITO' : 'DEBITO',
                serie: nota.serie,
                correlativo: nota.correlativo,
                ruc: nota.empresa_Ruc,
                content: nota,
            })
            return {
                codigo: status || 500,
                respuesta: {
                    success: false,
                    message: message || 'Error desconocido al emitir la nota.',
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

        let detalleFormateado = [];

        if (nota.motivo_Cod == "05") {
            nota.detalle.forEach((detalle) => {
                detalleFormateado.push({
                    ...detalle,
                    Descuentos: detalle.Descuentos
                        ? JSON.stringify(detalle.Descuentos)
                        : null,
                });
            });
        } else {
            detalleFormateado = nota.detalle;
        }

        // ? 5 Juntar el resultado 
        const notaEstructurada = {
            ...nota,
            detalle: detalleFormateado,
            factura_id: nota.factura_id,
            guia_id: null,
            estado: estado,
        }

        // ? 6 estructurar para la bd
        const { detalle = [], legend = [], id_borrador, ...notaData } = notaEstructurada;

        // ? 7 Guardar en la BD
        const resultado = await repository.crear({
            nota: notaData,
            detalle: detalle,
            legend: legend,
            sunat_respuesta: sunat_respuesta
        })

        if (!resultado?.success) {
            registrarLogFactiliza('ERROR_BD_NOTA', {
                tipo: nota.tipo_Doc == '07' ? 'CREDITO' : 'DEBITO',
                serie: nota.serie,
                correlativo: nota.correlativo,
                ruc: nota.empresa_Ruc,
                mensaje: resultado?.message,
                content: notaEstructurada,
                sunat: sunat_respuesta
            });
            return {
                codigo: 400,
                respuesta: {
                    success: false,
                    message:
                        resultado?.message ||
                        'La nota fue enviada, pero no se pudo registrar en la base de datos.',
                    data: null,
                    status: 400,
                },
            };
        }
        let messageParaElCliente = message || '';
        let statusParaElCliente = 200;
        if (estado == 'PENDIENTE') {
            messageParaElCliente = 'La nota fue emitida, pero se encuentra pendiente de autorización en la SUNAT.'
            statusParaElCliente = 200
        } else if (estado == 'RECHAZADA') {
            messageParaElCliente = 'La nota fue rechazada por la SUNAT, verifique los detalles para obtener mas información.'
            statusParaElCliente = 400
        } else if (estado == 'EMITIDA') {
            messageParaElCliente = 'La nota fue emitida y registrada correctamente.'
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
        registrarLogFactiliza('EXCEPTION_NOTA', {
            tipo: nota.tipo_Doc == '07' ? 'CREDITO' : 'DEBITO',
            serie: nota?.serie,
            correlativo: nota?.correlativo,
            message: error?.response?.data?.message || error?.message,
            error_factiliza: error?.response?.data,
            content: nota
        });
        return {
            codigo: 400,
            respuesta: {
                success: false,
                message:
                    error?.response?.data?.message ||
                    error?.message ||
                    'Error interno al emitir la nota.',
                detailed_message: null,
                error_factiliza: error?.response?.data,
                status: 500,
            },
        };
    }
}
