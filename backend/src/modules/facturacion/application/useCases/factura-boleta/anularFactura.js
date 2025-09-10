module.exports = async (body, facturaRepository) => {
    // Validaciones básicas
    const { empresa_ruc, correlativo, serie, tipo_Doc } = body;

    if (!empresa_ruc || !correlativo || !serie || !tipo_Doc) {
        return {
            codigo: 400,
            respuesta: {
                success: false,
                message: "Faltan datos requeridos: empresa_ruc, correlativo, serie y tipo_Doc son obligatorios.",
                data: null,
            }
        };
    }

    const result = await facturaRepository.anular(body);

    if (!result.success) {
        //? Determinar el código de error basado en el mensaje
        let codigo = 500;
        if (result.message.includes('No se encontró') || result.message.includes('no se encontró')) {
            codigo = 404;
        } else if (result.message.includes('ya se encuentra anulada') || result.message.includes('ya está anulada')) {
            codigo = 409; // Conflict
        }

        return {
            codigo,
            respuesta: {
                status: result.status,
                success: false,
                message: result.message || "La factura no se pudo anular correctamente.",
                data: null,
            }
        };
    }

    return {
        codigo: 200,
        respuesta: {
            status: 200,
            success: true,
            message: "La factura se anuló correctamente.",
            data: {
                factura_id: result.data?.factura?.id,
                serie: result.data?.factura?.serie,
                correlativo: result.data?.factura?.correlativo,
                estado: result.data?.factura?.estado,
                sunat_procesado: !!result.data?.sunat_respuesta
            },
        }
    };
}