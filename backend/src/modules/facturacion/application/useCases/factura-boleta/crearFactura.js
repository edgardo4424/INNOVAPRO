module.exports = async (body, facturaRepository, borradorRepository) => {

    //* 1. Desestructuración de los datos del body:
    const {
        detalle = [],
        forma_pago = [],
        legend = [],
        sunat_respuesta = {},
        id_borrador,
        ...factura
    } = body;

    //* 2. Construir el objeto 'factura' con los datos principales
    const facturaData = {
        ...factura,
    };


    //* 3. Validación de entrada: Ahora verificamos un campo clave de la factura principal
    if (!facturaData.tipo_Doc || !facturaData.serie || !facturaData.correlativo) {
        return {
            codigo: 400,
            respuesta: {
                mensaje: "Faltan campos esenciales para la factura (tipo_Doc, serie, correlativo).",
                estado: false,
                datos: null,
            },
        };
    }

    // todo: Validacion si ya se registro una factura con ese correlativo o serie
    if (facturaData.estado) {
        const facturaExistente = await facturaRepository.buscarExistencia(facturaData.serie, facturaData.correlativo, facturaData.estado);
        if (facturaExistente) {
            return {
                codigo: 409,
                respuesta: {
                    mensaje: "La factura ya existe en la base de datos. Correlativo: " + correlativo + " Serie: " + serie + " Estado: " + estado,
                    estado: false,
                    datos: null,
                    success: false,
                    status: 409
                },
            };
        }
    }

    try {
        //* 4. Llamar al repositorio con el objeto 'facturaData' y los arrays de componentes
        const resultadoCreacion = await facturaRepository.crear({
            factura: facturaData,
            detalle: detalle,
            formas_pagos: forma_pago,
            leyendas: legend,
            sunat_respuesta
        });


        //* 5. Evaluar el resultado de la operación del repositorio
        if (!resultadoCreacion.success) {
            return {
                codigo: 500,
                respuesta: {
                    mensaje: resultadoCreacion.message || "No se pudo crear la factura y sus componentes.",
                    estado: false,
                    datos: resultadoCreacion.data,
                    success: false,
                    status: 400
                },
            };
        }

        // * Despues de haber creado la factura, borramos el borrador si este fue creado por ese medio
        if (id_borrador) {
            await borradorRepository.eliminar(id_borrador);
        }

        //* 6. Retornar éxito
        return {
            codigo: 201,
            respuesta: {
                mensaje: "Factura y sus componentes creados correctamente.",
                estado: true,
                facturaCreada: true,
                success: true,
                status: 201
            },
        };

    } catch (error) {
        //! 7. Manejo de errores centralizado para cualquier excepción no prevista
        console.error("Error al procesar la creación de la factura:", error.message, error.stack);
        return {
            codigo: 500,
            respuesta: {
                mensaje: "Ocurrió un error interno al crear la factura.",
                estado: false,
                datos: null,
                success: false,
                status: 400
            },
        };
    }
};