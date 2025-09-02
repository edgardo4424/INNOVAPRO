module.exports = async (body, notaRepository) => {

    //* 1. Desestructuración de los datos del body:
    const {
        detalle = [],
        legend = [],
        id_factura,
        sunat_respuesta,
        ...factura
    } = body;



    //* 2. Construir el objeto 'factura' con los datos principales
    const notaData = {
        ...factura,
    };


    // //* 3. Validación de entrada: Ahora verificamos un campo clave de la factura principal
    // if (!notaData.tipo_Doc || !notaData.serie || !notaData.correlativo) {
    //     return {
    //         codigo: 400,
    //         respuesta: {
    //             mensaje: "Faltan campos esenciales para la factura (tipo_Doc, serie, correlativo).",
    //             estado: false,
    //             datos: null,
    //         },
    //     };
    // }

    // // todo: Validacion si ya se registro una factura con ese correlativo o serie
    // if (facturaData.estado) {
    //     const facturaExistente = await notaRepository.buscarExistencia(facturaData.serie, facturaData.correlativo, facturaData.estado);
    //     console.log("🚚 facturaExistente:", facturaExistente);
    //     if (facturaExistente) {
    //         return {
    //             codigo: 409,
    //             respuesta: {
    //                 mensaje: "La factura ya existe en la base de datos. Correlativo: " + correlativo + " Serie: " + serie + " Estado: " + estado,
    //                 estado: false,
    //                 datos: null,
    //                 success: false,
    //                 status: 409
    //             },
    //         };
    //     }
    // }

    try {
        //* 4. Llamar al repositorio con el objeto 'facturaData' y los arrays de componentes
        const resultadoCreacion = await notaRepository.crear({
            nota: notaData,
            detalle: detalle,
            leyendas: legend,
            sunat_respuesta,
            id_factura: id_factura
        });


        //* 5. Evaluar el resultado de la operación del repositorio
        if (!resultadoCreacion.success) {
            return {
                codigo: 500,
                respuesta: {
                    message: resultadoCreacion.message || "No se pudo crear la nota y sus componentes.",
                    data: resultadoCreacion.data,
                    success: false,
                    status: 400
                },
            };
        }


        //* 6. Retornar éxito
        return {
            codigo: 201,
            respuesta: {
                mensaje: "La nota y sus componentes creados correctamente.",
                estado: true,
                notaCreada: true,
                success: true,
                status: 201
            },
        };

    } catch (error) {
        //! 7. Manejo de errores centralizado para cualquier excepción no prevista
        console.error("Error al procesar la creación de la nota:", error.message, error.stack);
        return {
            codigo: 500,
            respuesta: {
                mensaje: "Ocurrió un error interno al crear la nota.",
                datos: null,
                success: false,
                status: 400
            },
        };
    }
};