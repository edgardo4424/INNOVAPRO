class FormaPago {
    constructor({
        // factura_id,
        tipo,
        monot,
        cuota,
        fecha_pago,
    }) {
        this.factura_id = factura_id;
        this.tipo = tipo;
        this.monot = monot;
        this.cuota = cuota;
        this.fecha_pago = fecha_pago;
    }

    static crear(props) {
        // Todos los campos son `allowNull: false` en tu modelo Sequelize, por lo tanto, son requeridos.
        // const camposRequeridos = [
        //     // "factura_id",
        //     "tipo",
        //     "monot",
        //     "cuota",
        //     "fecha_pago",
        // ];

        // for (const campo of camposRequeridos) {
        //     if (props[campo] === undefined || props[campo] === null || (typeof props[campo] === 'string' && props[campo].trim() === '')) {
        //         return {
        //             success: false,
        //             message: `El campo '${campo}' es requerido para crear la forma de pago.`,
        //             formaPago: null
        //         };
        //     }
        // }

        // if (typeof props.factura_id !== 'number' || !Number.isInteger(props.factura_id) || props.factura_id <= 0) {
        //     return {
        //         success: false,
        //         message: "El 'factura_id' debe ser un número entero positivo.",
        //         formaPago: null
        //     };
        // }

        // if (typeof props.monot !== 'number' || props.monot < 0) {
        //     return {
        //         success: false,
        //         message: "El 'monto' (monot) debe ser un número no negativo.",
        //         formaPago: null
        //     };
        // }

        // if (typeof props.cuota !== 'number' || !Number.isInteger(props.cuota) || props.cuota <= 0) {
        //     return {
        //         success: false,
        //         message: "La 'cuota' debe ser un número entero positivo.",
        //         formaPago: null
        //     };
        // }

        // if (!(props.fecha_pago instanceof Date) || isNaN(props.fecha_pago)) {
        //     return {
        //         success: false,
        //         message: "La 'fecha_pago' debe ser una fecha válida.",
        //         formaPago: null
        //     };
        // }


        return {
            success: true,
            message: "Forma de pago creada exitosamente.",
            formaPago: new FormaPago(props),
        };
    }

    static editar(props) {
        if (!props.id) {
            return {
                success: false,
                message: "Se requiere el 'id' para editar la forma de pago.",
                formaPago: null,
            };
        }

        if (props.monot !== undefined && (typeof props.monot !== 'number' || props.monot < 0)) {
            return {
                success: false,
                message: "El 'monto' (monot) debe ser un número no negativo.",
                formaPago: null
            };
        }

        if (props.cuota !== undefined && (typeof props.cuota !== 'number' || !Number.isInteger(props.cuota) || props.cuota <= 0)) {
            return {
                success: false,
                message: "La 'cuota' debe ser un número entero positivo.",
                formaPago: null
            };
        }

        if (props.fecha_pago !== undefined && (!(props.fecha_pago instanceof Date) || isNaN(props.fecha_pago))) {
            return {
                success: false,
                message: "La 'fecha_pago' debe ser una fecha válida.",
                formaPago: null
            };
        }

        return {
            success: true,
            message: "Campos de forma de pago válidos para edición.",
            formaPago: new FormaPago(props),
        };
    }
}

// Exporta la clase para que pueda ser usada en otras partes de tu aplicación
module.exports = FormaPago;