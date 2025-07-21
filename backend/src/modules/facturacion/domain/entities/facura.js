class Factura {
    constructor({
        tipo_operacion,
        tipo_doc,
        serie,
        correlativo,
        tipo_moneda,
        fecha_emision,
        empresa_ruc,
        cliente_tipo_doc,
        cliente_num_doc,
        cliente_razon_social,
        cliente_direccion,
        monto_oper_gravadas,
        monto_oper_exoneradas,
        monto_igv,
        total_impuestos,
        valor_venta,
        sub_total,
        monto_imp_venta,
        estado_documento,
        estado,
        manual,
        id_base_dato,
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
    }) {
        this.tipo_operacion = tipo_operacion;
        this.tipo_doc = tipo_doc;
        this.serie = serie;
        this.correlativo = correlativo;
        this.tipo_moneda = tipo_moneda;
        this.fecha_emision = fecha_emision;
        this.empresa_ruc = empresa_ruc;
        this.cliente_tipo_doc = cliente_tipo_doc;
        this.cliente_num_doc = cliente_num_doc;
        this.cliente_razon_social = cliente_razon_social;
        this.cliente_direccion = cliente_direccion;
        this.monto_oper_gravadas = monto_oper_gravadas;
        this.monto_oper_exoneradas = monto_oper_exoneradas;
        this.monto_igv = monto_igv;
        this.total_impuestos = total_impuestos;
        this.valor_venta = valor_venta;
        this.sub_total = sub_total;
        this.monto_imp_venta = monto_imp_venta;
        this.estado_documento = estado_documento;
        this.estado = estado;
        this.manual = manual;
        this.id_base_dato = id_base_dato;
        this.usuario_id = usuario_id;
        this.detraccion_cod_bien_detraccion = detraccion_cod_bien_detraccion;
        this.detraccion_cod_medio_pago = detraccion_cod_medio_pago;
        this.detraccion_cta_banco = detraccion_cta_banco;
        this.detraccion_percent = detraccion_percent;
        this.detraccion_mount = detraccion_mount;
        this.descuento_cod_tipo = descuento_cod_tipo;
        this.descuento_monto_base = descuento_monto_base;
        this.descuento_factor = descuento_factor;
        this.descuento_monto = descuento_monto;
    }

    static crear(props) {
        const camposRequeridos = [
            // "tipo_operacion",
            // "tipo_doc",
            // "serie",
            // "correlativo",
            // "tipo_moneda",
            // "fecha_emision",
            // "empresa_ruc",
            // "cliente_num_doc",
            // "cliente_razon_social",
            // "valor_venta",
            // "monto_imp_venta",
            // "estado_documento",
        ];

        for (const campo of camposRequeridos) {
            if (!props[campo]) {
                return {
                    success: false,
                    message: `El campo '${campo}' es requerido para crear la factura.`,
                    factura: null
                };
            }
        }

        const estadosValidos = ["BORRADOR", "EMITIDA", "RECHAZADA", "ANULADA", "OBSERVADA"];
        if (props.estado_documento && !estadosValidos.includes(props.estado_documento)) {
            return {
                success: false,
                message: `El estado de documento '${props.estado_documento}' no es válido.`,
                factura: null
            };
        }

        return {
            success: true,
            message: "Factura creada exitosamente.",
            factura: new Factura(props),
        };
    }

    static editar(props) {
        if (!props.id) {
            return {
                success: false,
                message: "Se requiere el 'id' para editar la factura.",
                factura: null,
            };
        }

        return {
            success: true,
            message: "Campos de factura válidos para edición.",
            factura: new Factura(props),
        };
    }
}

module.exports = Factura;