export async function  validarModal (tipo, item) {
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
            // { key: "cuota" },
            { key: "fecha_Pago" },
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
                message: "⚠️ Verifica los datos del Pago"
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