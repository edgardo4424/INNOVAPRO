export async function validarModal(tipo, item, factura, cuotasGeneradas = null) {
    if (tipo == "producto") {
        const camposRequeridos = [
            { key: "unidad" },
            { key: "cantidad" },
            // { key: "cod_Producto" },
            { key: "descripcion" },
            // { key: "monto_valor_Unitario" },
            // { key: "monto_Base_Igv" },
            // { key: "porcentaje_Igv" },
            // { key: "igv" },
            { key: "tip_Afe_Igv" },
            // { key: "total_Impuestos" },
            { key: "monto_Precio_Unitario" },
            { key: "monto_Valor_Venta" },
            // { key: "factor_Icbper" },
        ];

        const errores = {};

        for (const campo of camposRequeridos) {
            const valor = item[campo.key];
            if (!valor || valor.toString().trim() === "" || valor === 0) {
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
                message: "⚠️ Verifica los datos del Producto"
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

    if (tipo == "pago") {
        const camposRequeridos = [
            { key: "tipo" },
            { key: "monto" },
            { key: "cuota" },
            { key: "fecha_Pago" },
        ];

        const errores = {};
        let message;

        // Validar tipo de pago
        if (!item.tipo || item.tipo.toString().trim() === "") {
            errores.tipo = true;
        } else {
            errores.tipo = false;
        }

        if (item.tipo == "Contado") {
            // Validación para pago CONTADO (lógica original)
            if (!item.monto || item.monto <= 0) {
                errores.monto = true;
            } else {
                errores.monto = false;
            }

            if (item.cuota != 0) {
                errores.cuota = true;
            } else {
                errores.cuota = false;
            }

            if (!item.fecha_Pago || item.fecha_Pago.toString().trim() === "") {
                errores.fecha_Pago = true;
            } else {
                errores.fecha_Pago = false;
            }

        } else if (item.tipo == "Credito") {
            // Validación para pago CREDITO con múltiples cuotas

            // Si se proporcionan cuotas generadas, validar cada una
            if (cuotasGeneradas && cuotasGeneradas.length > 0) {
                let errorEnCuotas = false;
                let mensajeError = "";

                for (let i = 0; i < cuotasGeneradas.length; i++) {
                    const cuota = cuotasGeneradas[i];

                    // Validar monto de cada cuota
                    if (!cuota.monto || cuota.monto <= 0) {
                        errorEnCuotas = true;
                        mensajeError = `La cuota ${cuota.cuota} tiene un monto inválido`;
                        break;
                    }

                    // Validar fecha de cada cuota
                    if (!cuota.fecha_Pago || cuota.fecha_Pago.toString().trim() === "") {
                        errorEnCuotas = true;
                        mensajeError = `La cuota ${cuota.cuota} no tiene fecha de pago`;
                        break;
                    }

                    // Validar que la fecha de pago sea posterior a la fecha de emisión
                    if (new Date(cuota.fecha_Pago) <= new Date(factura.fecha_Emision)) {
                        errorEnCuotas = true;
                        mensajeError = `La fecha de pago de la cuota ${cuota.cuota} debe ser posterior a la fecha de emisión de la factura`;
                        break;
                    }

                    // Validar número de cuota
                    if (!cuota.cuota || cuota.cuota < 1) {
                        errorEnCuotas = true;
                        mensajeError = `La cuota ${i + 1} tiene un número de cuota inválido`;
                        break;
                    }
                }

                if (errorEnCuotas) {
                    return {
                        errores: {
                            tipo: false,
                            monto: true,
                            cuota: true,
                            fecha_Pago: true
                        },
                        validos: false,
                        message: mensajeError
                    };
                }

                // Si todas las cuotas son válidas
                errores.monto = false;
                errores.cuota = false;
                errores.fecha_Pago = false;

            } else {
                // Validación tradicional para crédito sin cuotas generadas
                if (!item.monto || item.monto <= 0) {
                    errores.monto = true;
                } else {
                    errores.monto = false;
                }

                if (item.cuota < 1 || item.cuota == "" || item.cuota == '') {
                    errores.cuota = true;
                } else {
                    errores.cuota = false;
                }

                if (!item.fecha_Pago || item.fecha_Pago.toString().trim() === "") {
                    errores.fecha_Pago = true;
                } else {
                    errores.fecha_Pago = false;
                }

                if (item.fecha_Pago && new Date(item.fecha_Pago) <= new Date(factura.fecha_Emision)) {
                    errores.fecha_Pago = true;
                    message = "La fecha de pago debe ser posterior a la fecha de emisión de la factura";
                }
            }
        }

        const hayErrores = Object.values(errores).some((val) => val === true);

        if (hayErrores) {
            return {
                errores,
                validos: false,
                message: message ? message : "⚠️ Verifica los datos del Pago"
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
}