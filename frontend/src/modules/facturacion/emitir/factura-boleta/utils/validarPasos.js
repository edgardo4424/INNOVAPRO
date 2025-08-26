// La misma función de utilidad para verificar valores nulos o vacíos.
function isNullOrEmpty(value) {
    return value === undefined || value === null || (typeof value === 'string' && value.trim() === '');
}

export async function validarFacturaCompleta(Factura) {
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
                { key: "cod_Producto", name: "Código de Producto" },
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

    if (Factura.forma_pago && Factura.forma_pago.length > 0) {
        const montoTotalPagos = Factura.forma_pago.reduce(
            (total, pago) => total + (parseFloat(pago.monto) || 0),
            0
        );
        const montoTotalFactura = parseFloat(Factura.monto_Imp_Venta || 0);

        if (montoTotalPagos < montoTotalFactura) {
            errores.forma_pago_monto = "La suma de los pagos no cubre el monto total de la factura.";
            validos = false;
        }
    }

    // 4. Devolver el resultado
    return {
        errores,
        validos,
        message: validos ? "🎉 ¡Factura lista para emitir!" : "⚠️ El formulario contiene errores. Por favor, revísalos."
    };
}

