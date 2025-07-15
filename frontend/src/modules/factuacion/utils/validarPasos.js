
export function validarPasos(pasoActual, Factura) {

    if (!Factura) {
        console.error("Error: 'Factura' object is missing in validarPasos call for", pasoActual);
        return { errores: null, validos: false, message: "Error interno de validación: Factura no proporcionada." };
    }

    if (pasoActual === "DatosDelComprobante") {
        const camposRequeridos = [
            { key: "tipo_Operacion" },
            { key: "tipo_Doc" },
            { key: "serie" },
            { key: "correlativo" },
            { key: "tipo_Moneda" },
            { key: "fecha_Emision" },
            { key: "empresa_Ruc" },
        ];

        const errores = {};

        for (const campo of camposRequeridos) {
            const valor = Factura[campo.key];
            if (!valor || valor.toString().trim() === "") {
                errores[campo.key] = true;
            } else {
                errores[campo.key] = false
            }
        }

        const hayErrores = Object.values(errores).some((val) => val === true);

        if (hayErrores) {
            return {
                errores,
                validos: false,
                message: "⚠️ Verifica los datos del comprobante"
            };
        }


        return {
            errores: camposRequeridos.reduce((acc, curr) => {
                acc[curr.key] = false;
                return acc;
            }, {}),
            validos: true,
            message: ""
        };
    }



    if (pasoActual === "DatosDelCliente") {
        const camposRequeridos = [
            { key: "cliente_Tipo_Doc" },
            { key: "cliente_Num_Doc" },
            { key: "cliente_Razon_Social" },
        ];

        const errores = {};

        for (const campo of camposRequeridos) {
            const valor = Factura[campo.key];
            if (!valor || valor.toString().trim() === "") {
                errores[campo.key] = true;
            } else {
                errores[campo.key] = false
            }
        }

        const hayErrores = Object.values(errores).some((val) => val === true);

        if (hayErrores) {
            return {
                errores,
                validos: false,
                message: "⚠️ Verifica los datos del comprobante"
            };
        }


        return {
            errores: camposRequeridos.reduce((acc, curr) => {
                acc[curr.key] = false;
                return acc;
            }, {}),
            validos: true,
            message: ""
        };
    }

    if (pasoActual === "DatosDelProducto") {
        if (!Factura.detalle || Factura.detalle.length === 0) {
            return {
                errores: null,
                validos: false,
                message: "⚠️ Debes ingresar al menos un producto en el detalle."
            };
        }

        const allProductsValid = Factura.detalle.every(item =>
            (typeof item.cantidad === 'number' && item.cantidad > 0) &&
            (item.descripcion && typeof item.descripcion === 'string' && item.descripcion.trim() !== "") &&
            (typeof item.monto_Valor_Unitario === 'number' && item.monto_Valor_Unitario > 0)
        );

        if (!allProductsValid) {
            return {
                errores: null,
                validos: false,
                message: "⚠️ Algunos productos tienen datos incompletos o inválidos (cantidad, descripción, o valor unitario)."
            };
        }

        return {
            errores: null,
            validos: true,
            message: ""
        };
    }


    if (pasoActual === "FormaDePago") {
        const montoTotalPagos = Factura.forma_pago.reduce(
            (total, pago) => total + (parseFloat(pago.monto) || 0),
            0
        );

        const montoTotalFactura = parseFloat(Factura.monto_Imp_Venta || 0);
        const pagosCompletos = montoTotalPagos >= montoTotalFactura;

        if (Factura.forma_pago.length == 0) {
            return {
                errores: null,
                validos: false,
                message: "⚠️ Debes ingresar al menos un Pago. 1"
            };
        }
        if (!pagosCompletos) {
            return {
                errores: null,
                validos: false,
                message: "⚠️ Debes ingresar al menos un Pago. 2"
            };
        }
        return {
            errores: null,
            validos: true,
            message: ""
        };
    }

    // if (pasoActual === "ValidaCionTotal") {
    //     const { validos: validosComprobante } = validarPasos("DatosDelComprobante");
    //     const { validos: validosCliente } = validarPasos("DatosDelCliente");
    //     const { validos: validosProductos } = validarPasos("DatosDelProducto");
    //     const { validos: validosFormaDePago } = validarPasos("FormaDePago");
    //     if(!validosComprobante || !validosCliente || !validosProductos || !validosFormaDePago){
    //         return {
    //             errores: null,
    //             validos: false,
    //             message: "⚠️ Factura no válida"
    //         };
    //     }
    //     return {
    //         errores: null,
    //         validos: true,
    //         message: ""
    //     };
    // }
    if (pasoActual === "ValidaCionTotal") {
        // Pass Factura to sub-validations
        const { validos: validosComprobante, message: msgComprobante } = validarPasos("DatosDelComprobante", Factura);
        if (!validosComprobante) return { errores: null, validos: false, message: msgComprobante };

        const { validos: validosCliente, message: msgCliente } = validarPasos("DatosDelCliente", Factura);
        if (!validosCliente) return { errores: null, validos: false, message: msgCliente };

        const { validos: validosProductos, message: msgProductos } = validarPasos("DatosDelProducto", Factura);
        if (!validosProductos) return { errores: null, validos: false, message: msgProductos };

        const { validos: validosFormaDePago, message: msgFormaDePago } = validarPasos("FormaDePago", Factura);
        if (!validosFormaDePago) return { errores: null, validos: false, message: msgFormaDePago };

        // If all sub-validations pass
        return {
            errores: null,
            validos: true,
            message: "🎉 ¡Factura lista para emitir!"
        };
    }

}