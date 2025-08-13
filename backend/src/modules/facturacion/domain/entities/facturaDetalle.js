class FacturaDetalle {
    constructor({
        factura_id,
        unidad,
        cantidad,
        cod_producto,
        descripcion,
        monto_valor_unitario,
        monto_base_igv,
        porcentaje_igv,
        igv,
        tip_afe_igv,
        total_impuestos,
        monto_precio_unitario,
        monto_valor_venta,
        factor_icbper,
    }) {
        this.factura_id = factura_id;
        this.unidad = unidad;
        this.cantidad = cantidad;
        this.cod_producto = cod_producto;
        this.descripcion = descripcion;
        this.monto_valor_unitario = monto_valor_unitario;
        this.monto_base_igv = monto_base_igv;
        this.porcentaje_igv = porcentaje_igv;
        this.igv = igv;
        this.tip_afe_igv = tip_afe_igv;
        this.total_impuestos = total_impuestos;
        this.monto_precio_unitario = monto_precio_unitario;
        this.monto_valor_venta = monto_valor_venta;
        this.factor_icbper = factor_icbper;
    }

    static crear(props) {

        const camposRequeridos = [
            // "factura_id",
            // "unidad",
            // "cantidad",
            // "cod_producto",
            // "descripcion",
            // "monto_valor_unitario",
            // "monto_base_igv",
            // "porcentaje_igv",
            // "igv",
            // "tip_afe_igv",
            // "total_impuestos",
            // "monto_precio_unitario",
            // "monto_valor_venta",
            // "factor_icbper",
        ];

        // for (const campo of camposRequeridos) {

        //     if (props[campo] === undefined || props[campo] === null || (typeof props[campo] === 'string' && props[campo].trim() === '')) {
        //         return {
        //             success: false,
        //             message: `El campo '${campo}' es requerido para crear el detalle de factura.`,
        //             facturaDetalle: null
        //         };
        //     }
        // }

        // if (typeof props.cantidad !== 'number' || props.cantidad <= 0) {
        //     return {
        //         success: false,
        //         message: "La cantidad debe ser un número positivo.",
        //         facturaDetalle: null
        //     };
        // }

        // if (typeof props.monto_valor_unitario !== 'number' || props.monto_valor_unitario < 0) {
        //     return {
        //         success: false,
        //         message: "El valor unitario debe ser un número no negativo.",
        //         facturaDetalle: null
        //     };
        // }

        return {
            success: true,
            message: "Detalle de factura creado exitosamente.",
            facturaDetalle: new FacturaDetalle(props),
        };
    }

    static editar(props) {
        if (!props.id) {
            return {
                success: false,
                message: "Se requiere el 'id' para editar el detalle de factura.",
                facturaDetalle: null,
            };
        }

        if (props.cantidad !== undefined && (typeof props.cantidad !== 'number' || props.cantidad <= 0)) {
            return {
                success: false,
                message: "La cantidad debe ser un número positivo.",
                facturaDetalle: null
            };
        }

        return {
            success: true,
            message: "Campos de detalle de factura válidos para edición.",
            facturaDetalle: new FacturaDetalle(props),
        };
    }
}

module.exports = FacturaDetalle;