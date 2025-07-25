module.exports = async (body, facturaRepository) => {

    //* 1. Desestructuración de los datos del body:
    const {
        tipo_Operacion,
        tipo_Doc,
        serie,
        correlativo,
        tipo_Moneda,
        fecha_Emision,
        empresa_Ruc,
        cliente_Tipo_Doc,
        cliente_Num_Doc,
        cliente_Razon_Social,
        cliente_Direccion,
        monto_Oper_Gravadas,
        monto_Oper_Exoneradas,
        monto_Igv,
        total_Impuestos,
        valor_Venta,
        sub_Total,
        monto_Imp_Venta,
        estado_Documento,
        estado,
        manual,
        id_Base_Dato,
        observaciones,
        usuario_id,
        detraccion_cod_bien_detraccion,
        detraccion_cod_medio_pago,
        detraccion_cta_banco,
        detraccion_percent,
        detraccion_mount,
        descuento_cod_tipo,
        descuento_monto_base,
        descuento_factor,
        descuento_monto,
        detalle = [],
        forma_pago = [],
        legend = [],
        sunat_respuesta = {}
    } = body;

    //* 2. Construir el objeto 'factura' con los datos principales
    const facturaData = {
        tipo_Operacion,
        tipo_Doc,
        serie,
        correlativo,
        tipo_Moneda,
        fecha_Emision,
        empresa_Ruc,
        cliente_Tipo_Doc,
        cliente_Num_Doc,
        cliente_Razon_Social,
        cliente_Direccion,
        monto_Oper_Gravadas,
        monto_Oper_Exoneradas,
        monto_Igv,
        total_Impuestos,
        valor_Venta,
        sub_Total,
        monto_Imp_Venta,
        estado_Documento,
        estado,
        manual,
        id_Base_Dato,
        observaciones,
        usuario_id,
        detraccion_cod_bien_detraccion,
        detraccion_cod_medio_pago,
        detraccion_cta_banco,
        detraccion_percent,
        detraccion_mount,
        descuento_cod_tipo,
        descuento_monto_base,
        descuento_factor,
        descuento_monto,
    };


    console.log("************************CUERPO DE LA FACTURA", facturaData);
    //* 3. Validación de entrada: Ahora verificamos un campo clave de la factura principal
    if (!tipo_Doc || !serie || !correlativo) {
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
    if(estado){
        const facturaExistente = await facturaRepository.buscarExistencia(serie, correlativo, estado);
        console.log("🚚 facturaExistente:", facturaExistente);
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