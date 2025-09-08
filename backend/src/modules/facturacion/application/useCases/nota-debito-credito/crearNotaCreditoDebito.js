module.exports = async (body, notaRepository) => {
    //* 1. Desestructuración de los datos del body:
    const {
        detalle = [],
        legend = [],
        sunat_respuesta,
        ...factura
    } = body;

    //* 2. Construir el objeto 'factura' con los datos principales
    const notaData = {
        ...factura,
    };

    //* 3. Modificar el array 'detalle' si se cumplen las condiciones
    let modifiedDetalle = detalle;
    if (notaData.tipo_Doc === "07" && notaData.motivo_Cod === "05") {
        modifiedDetalle = detalle.map(item => {
            if (item.Descuentos && Array.isArray(item.Descuentos) && item.Descuentos.length > 0) {
                return {
                    ...item,
                    Descuentos: JSON.stringify(item.Descuentos)
                };
            }
            return item;
        });
    }

    try {
        //* 4. Llamar al repositorio con el objeto 'facturaData' y los arrays de componentes
        const resultadoCreacion = await notaRepository.crear({
            nota: notaData,
            detalle: modifiedDetalle, // Usamos el array modificado
            leyendas: legend,
            sunat_respuesta,
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
                message: "La nota y sus componentes creados correctamente.",
                data: true,
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
                message: "Ocurrió un error interno al crear la nota.",
                data: null,
                success: false,
                status: 400
            },
        };
    }
};