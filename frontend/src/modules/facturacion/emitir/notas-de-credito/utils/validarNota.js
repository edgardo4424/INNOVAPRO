// The same utility function to check for null or empty values.
function isNullOrEmpty(value) {
    return value === undefined || value === null || (typeof value === 'string' && value.trim() === '');
}

export async function validarNotaCompleta(Nota, documento_Afectado) {
    if (!Nota) {
        return {
            errores: null,
            validos: false,
            message: "Error interno de validación: Nota no proporcionada."
        };
    }
    const errores = {};
    let validos = true;

    // Required global fields for the note
    const camposGlobales = [
        { key: "tipo_Operacion", name: "Tipo de Operación" },
        { key: "tipo_Doc", name: "Tipo de Documento" },
        { key: "serie", name: "Serie" },
        { key: "correlativo", name: "Correlativo" },
        { key: "fecha_Emision", name: "Fecha de Emisión" },
        { key: "tipo_Moneda", name: "Tipo de Moneda" },
        { key: "empresa_Ruc", name: "RUC de la Empresa" },
        { key: "cliente_Tipo_Doc", name: "Tipo de Documento del Cliente" },
        { key: "cliente_Num_Doc", name: "N° Documento del Cliente" },
        { key: "cliente_Razon_Social", name: "Razón Social del Cliente" },
        { key: "afectado_Tipo_Doc", name: "Tipo de Documento Afectado" },
        { key: "afectado_Num_Doc", name: "Número de Documento Afectado" },
        { key: "motivo_Cod", name: "Código de Motivo" },
    ];

    // 1. Validate global fields
    camposGlobales.forEach(campo => {
        if (isNullOrEmpty(Nota[campo.key])) {
            errores[campo.key] = `El campo '${campo.name}' es requerido.`;
            validos = false;
        }
    });

    // 2. Validate detail fields of the note
    if (isNullOrEmpty(Nota.detalle) || Nota.detalle.length === 0) {
        errores.detalle = "El campo 'Detalle de Productos' no puede estar vacío.";
        validos = false;
    } else {
        Nota.detalle.forEach((item, index) => {
            if (isNullOrEmpty(item.cantidad) || isNullOrEmpty(item.descripcion) || isNullOrEmpty(item.monto_Valor_Unitario)) {
                errores[`detalle[${index}]`] = `El detalle n° ${index + 1} debe tener cantidad, descripción y valor unitario.`;
                validos = false;
            }
        });
    }

    // 3. Specific validations based on motive code
    if (Nota.tipo_Doc === "07") { // Credit Note
        // Validate full cancellation (01: Operation cancellation, 02: RUC error)
        if (Nota.motivo_Cod === "01" || Nota.motivo_Cod === "02") {
            if (!documento_Afectado) {
                errores.documento_afectado = "No se encontró el documento original para validar la anulación.";
                validos = false;
            } else {
                // Use a tolerance for float point comparisons
                const totalNote = parseFloat(Nota.monto_Imp_Venta).toFixed(2);
                const totalAffected = parseFloat(documento_Afectado.monto_Imp_Venta).toFixed(2);

                if (totalNote !== totalAffected) {
                    errores.monto_anulacion = `El monto total de la nota (${Nota.monto_Imp_Venta}) debe ser igual al del documento afectado (${documento_Afectado.monto_Imp_Venta}) para una anulación total.`;
                    validos = false;
                }

                if (Nota.detalle.length !== documento_Afectado.detalle.length) {
                    errores.detalle_anulacion = "La cantidad de items en la nota debe ser igual a la del documento afectado para una anulación total.";
                    validos = false;
                } else {
                    for (let i = 0; i < Nota.detalle.length; i++) {
                        const itemNota = Nota.detalle[i];
                        const itemAfectado = documento_Afectado.detalle[i];

                        if (parseFloat(itemNota.cantidad).toFixed(2) !== parseFloat(itemAfectado.cantidad).toFixed(2)) {
                            errores[`detalle[${i}]_cantidad`] = `La cantidad del item ${i + 1} de la nota debe ser igual a la del documento afectado.`;
                            validos = false;
                        }

                        if (parseFloat(itemNota.monto_Precio_Unitario).toFixed(2) !== parseFloat(itemAfectado.monto_Precio_Unitario).toFixed(2)) {
                            errores[`detalle[${i}]_monto`] = `El precio del item ${i + 1} de la nota debe ser igual a la del documento afectado.`;
                            validos = false;
                        }
                    }
                }
            }
        }
    }

    // 4. Return the result
    return {
        errores,
        validos,
        message: validos ? "🎉 ¡Nota lista para emitir!" : "⚠️ El formulario contiene errores. Por favor, revísalos."
    };
}