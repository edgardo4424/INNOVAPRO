// La misma función de utilidad para verificar valores nulos o vacíos.
function isNullOrEmpty(value) {
    return value === undefined || value === null || (typeof value === 'string' && value.trim() === '');
}

export async function validarFacturaCompleta(Factura, Detraccion, retencionActivado, Retencion, detallesExtra) {
    if (!Factura) {
        return {
            errores: null,
            validos: false,
            message: "Error interno de validación: Factura no proporcionada."
        };
    }

    const errores = {};
    let validos = true;

    // Campos globales requeridos (Comprobante y Cliente)
    const camposGlobales = [
        { key: "tipo_Operacion", name: "Tipo de Operación" },
        { key: "tipo_Doc", name: "Tipo de Documento" },
        { key: "serie", name: "Serie" },
        { key: "correlativo", name: "Correlativo" },
        { key: "tipo_Moneda", name: "Tipo de Moneda" },
        { key: "fecha_Emision", name: "Fecha de Emisión" },
        { key: "empresa_Ruc", name: "RUC de la Empresa" },
        { key: "cliente_Tipo_Doc", name: "Tipo de Documento del Cliente" },
        { key: "cliente_Num_Doc", name: "N° Documento del Cliente" },
        { key: "cliente_Razon_Social", name: "Razón Social del Cliente" },
    ];

    // Campos anidados requeridos (Detalle y Forma de Pago)
    const camposAnidados = [
        {
            key: "detalle",
            name: "Detalle de Productos",
            camposRequeridos: [
                { key: "unidad", name: "Unidad" },
                { key: "cantidad", name: "Cantidad" },
                // { key: "cod_Producto", name: "Código de Producto" },
                { key: "descripcion", name: "Descripción" },
                { key: "monto_Valor_Unitario", name: "Valor Unitario" },
            ]
        },
        {
            key: "forma_pago",
            name: "Forma de Pago",
            camposRequeridos: [
                { key: "tipo", name: "Tipo de Pago" },
                { key: "monto", name: "Monto del Pago" }
            ]
        }
    ];

    const camposDetraccion = [
        { key: "detraccion_cod_bien_detraccion", name: "Código de Bien Detracción" },
        { key: "detraccion_cod_medio_pago", name: "Código de Medio de Pago de Detracción" },
        { key: "detraccion_cta_banco", name: "N° Cuenta Banco de Detracción" },
        { key: "detraccion_percent", name: "Porcentaje de Detracción" },
        { key: "detraccion_mount", name: "Monto de Detracción" }
    ];

    const camposRetencion = [
        { key: "descuento_cod_tipo", name: "Código de Tipo de Retención" },
        { key: "descuento_factor", name: "Factor de Retención" },
        { key: "descuento_monto_base", name: "Monto Base de Retención" },
        { key: "descuento_monto", name: "Monto de Retención" }
    ];

    const camposDetallesExtra = [
        { key: "detalle", name: "Campo Nombre de Detalle extra Incompleto" },
        { key: "valor", name: "Campo Valor de Detalle extra Incompleto" }
    ];

    // 0. validar que correlativo no tenga mas de 8 caracteres y que no tenga ningun caracter especial ni letra 
    if (Factura.correlativo && Factura.correlativo.length > 8) {
        errores.correlativo = "El campo 'Correlativo' no puede tener más de 8 caracteres.";
        validos = false;
    }
    if (Factura.correlativo && /[^0-9]/.test(Factura.correlativo)) {
        errores.correlativo = "El campo 'Correlativo' solo puede contener números.";
        validos = false;
    }

    if (Factura.empresa_Ruc == Factura.cliente_Num_Doc) {
        errores.cliente_Num_Doc = "El RUC del cliente no puede ser igual al RUC del emisor.";
        validos = false;
    }

    // 1. Validar campos globales
    camposGlobales.forEach(campo => {
        if (isNullOrEmpty(Factura[campo.key])) {
            errores[campo.key] = `El campo '${campo.name}' es requerido.`;
            validos = false;
        }
    });

    // 2. Validar campos anidados (Detalle y Forma de Pago)
    camposAnidados.forEach(campo => {
        const nestedData = Factura[campo.key];

        if (isNullOrEmpty(nestedData) || nestedData.length === 0) {
            errores[campo.key] = `El campo '${campo.name}' no puede estar vacío.`;
            validos = false;
            return;
        }

        nestedData.forEach((item, index) => {
            campo.camposRequeridos.forEach(subCampo => {
                if (isNullOrEmpty(item[subCampo.key])) {
                    errores[`${campo.key}[${index}].${subCampo.key}`] = `El campo '${subCampo.name}' del ${campo.name} n° ${index + 1} es requerido.`;
                    validos = false;
                }
            });
        });
    });

    // 3. Validaciones específicas (montos y sumas)
    if (Factura.detalle && Factura.detalle.length > 0) {
        const montoProductosValid = Factura.detalle.every(item =>
            typeof item.cantidad === 'number' && item.cantidad > 0 &&
            typeof item.monto_Valor_Unitario === 'number' && item.monto_Valor_Unitario > 0
        );

        if (!montoProductosValid) {
            errores.detalle_valores = "Las cantidades y valores unitarios deben ser números mayores a 0.";
            validos = false;
        }
    }

    if (Factura.tipo_Operacion === "1001") {
        console.log(Detraccion);
        camposDetraccion.forEach(campo => {
            if (isNullOrEmpty(Detraccion[campo.key])) {
                errores[campo.key] = `El campo de'${campo.name}' en Detracción es requerido.`;
                validos = false;
            }
        });
    } else if (retencionActivado) {
        camposRetencion.forEach(campo => {
            if (isNullOrEmpty(Retencion[campo.key])) {
                errores[campo.key] = `El campo de'${campo.name}' en Detracción es requerido.`;
                validos = false;
            }
        });
    }

    if (Factura.forma_pago && Factura.forma_pago.length > 0) {
        const montoTotalFacturaCentavos = Math.round(Factura.monto_Imp_Venta * 100);

        const montoTotalPagosCentavos = Factura.forma_pago.reduce(
            (total, pago) => total + Math.round((parseFloat(pago.monto) || 0) * 100),
            0
        );
        if (montoTotalPagosCentavos !== montoTotalFacturaCentavos) {
            errores.forma_pago_monto = "La suma de los pagos no cubre el monto total de la factura.";
            validos = false;
        }

        const fechaEmision = new Date(Factura.fecha_Emision);
        const pagosACredito = Factura.forma_pago.filter(pago => pago.tipo === "CREDITO");

        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        const pagosConFechaAnteriorOIgualAEmision = pagosACredito.filter(pago => {
            const fechaPago = new Date(pago.fecha_Pago);
            fechaPago.setHours(0, 0, 0, 0);

            return fechaPago <= fechaEmision;
        });

        // **NUEVA VALIDACIÓN (Si quieres evitar que la cuota sea hoy)**
        const pagosConFechaIgualAHoy = pagosACredito.filter(pago => {
            const fechaPago = new Date(pago.fecha_Pago);
            fechaPago.setHours(0, 0, 0, 0); // Limpiamos la hora

            return fechaPago.getTime() === hoy.getTime();
        });


        // Dejamos tu validación original (fecha_Pago <= fecha_Emision)
        if (pagosConFechaAnteriorOIgualAEmision.length > 0) {
            errores.forma_pago_fecha = "La fecha de pago a crédito no puede ser anterior o igual a la fecha de emisión.";
            validos = false;
        }

        // Agregamos una validación para evitar que el pago a crédito se programe para HOY
        if (pagosConFechaIgualAHoy.length > 0) {
            errores.forma_pago_fecha_hoy = "Los pagos a crédito deben ser posteriores a la fecha actual.";
            validos = false;
        }
    }

    if (detallesExtra && detallesExtra.length > 0) {
        detallesExtra.forEach((detalle, index) => {
            camposDetallesExtra.forEach(campo => {
                if (detalle[campo.key] === "") {
                    errores[`${campo.key}[${index}]`] = `El campo '${campo.name}' no puede estar vacío.`;
                    validos = false;
                }
            });
        });
    }

    // 4. Devolver el resultado
    return {
        errores,
        validos,
        message: validos ? "🎉 ¡Factura lista para emitir!" : "⚠️ El formulario contiene errores. Por favor, revísalos."
    };
}