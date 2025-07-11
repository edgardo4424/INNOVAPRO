import { toast } from "react-toastify";

export function validarPasos(pasoActual, Factura) {

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
        if (Factura.detalle.length === 0) {
            return {
                errores: null,
                validos: false,
                message: "⚠️ Debes ingresar al menos un Producto."
            };
        }
        return {
            errores: null,
            validos: true,
            message: ""
        };
    }

    // if (pasoActual === "DatosDelProducto") {
    //     if (!Factura.forma_pago.length) {
    //         toast.error("⚠️ Debes ingresar al menos un Pago.", { autoClose: 2000 });
    //         return false;
    //     }
    //     return true;
    // }
}