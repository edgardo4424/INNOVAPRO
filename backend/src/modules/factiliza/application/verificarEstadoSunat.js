const factilizaClient = require('../api/apifactiliza');

module.exports = async (documentos_pendiente, repository) => {
    try {
        const resultados = [];

        for (const doc of documentos_pendiente) {
            const { empresa_ruc, tipo_Doc, serie, correlativo } = doc;

            const body = {
                empresa_ruc,
                tipo_Doc,
                serie,
                correlativo
            };

            try {
                const response = await factilizaClient.post(
                    'documento-cabecera/documento-detallado',
                    body
                );

                const fullData = response.data?.data;

                if (response.data?.success && fullData) {
                    const data = {
                        fecha_Emision: fullData.fecha_Emision,
                        hash: fullData.hash,
                        estado_Envio: fullData.estado_Envio,
                        estado_Sunat: fullData.estado_Sunat,
                        respuesta_Sunat: fullData.respuesta_Sunat,
                        respuesta_Fecha: fullData.respuesta_Fecha,
                        fecha_Registro: fullData.fecha_Registro
                    };

                    // ⚙️ Determinar estado del documento según las reglas
                    let estadoFinal = 'PENDIENTE';

                    if (data.estado_Envio === '0') {
                        if (data.estado_Sunat === '0') {
                            estadoFinal = 'EMITIDA';
                        } else if (['0133', '1033', 'HTTP', '0100', '0109', '0135', '0136', '91510', 'InternalServerError'].includes(data.respuesta_Sunat.errorCode)) {
                            estadoFinal = 'PENDIENTE';
                        }
                        else {
                            estadoFinal = 'RECHAZADA';
                        }

                        // 🔹 Actualizar en base de datos SOLO si se emitió o rechazó
                        await repository.actualizarEstado(doc, data);
                    }

                    resultados.push({
                        empresa_ruc,
                        tipo_Doc,
                        serie,
                        correlativo,
                        estado: estadoFinal
                    });

                } else {
                    resultados.push({
                        empresa_ruc,
                        tipo_Doc,
                        serie,
                        correlativo,
                        estado: 'PENDIENTE'
                    });
                }

            } catch (error) {
                console.warn('⚠️ Error al consultar Factiliza:', {
                    doc,
                    error: error?.response?.data || error.message
                });

                resultados.push({
                    empresa_ruc,
                    tipo_Doc,
                    serie,
                    correlativo,
                    estado: 'PENDIENTE'
                });
            }
        }

        // 🔹 Devolver resultado final con solo los campos requeridos
        return {
            codigo: 200,
            respuesta: {
                mensaje: 'ok',
                success: true,
                status: 200,
                documentos: resultados,
            }
        };

    } catch (err) {
        return {
            codigo: 500,
            respuesta: {
                mensaje: 'error interno',
                detalle: err?.message
            }
        };
    }
};
