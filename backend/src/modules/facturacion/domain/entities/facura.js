class Factura {
    constructor({
        tipo_Operacion,
        tipo_Doc,
        serie,
        correlativo,
        tipo_Moneda,
        fecha_Emision,
        empresa_Ruc,
        cliente_Tipo_Doc,
        cliente_Num_Doc,
        cliente_Razon_Social,
        cliente_Direccion,
        monto_Oper_Gravadas,
        monto_Oper_Exoneradas,
        monto_Igv,
        total_Impuestos,
        valor_Venta,
        sub_Total,
        monto_Imp_Venta,
        estado_Documento,
        estado,
        manual,
        id_Base_Dato,
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
        this.tipo_Operacion = tipo_Operacion;
        this.tipo_Doc = tipo_Doc;
        this.serie = serie;
        this.correlativo = correlativo;
        this.tipo_Moneda = tipo_Moneda;
        this.fecha_Emision = fecha_Emision;
        this.empresa_Ruc = empresa_Ruc;
        this.cliente_Tipo_Doc = cliente_Tipo_Doc;
        this.cliente_Num_Doc = cliente_Num_Doc;
        this.cliente_Razon_Social = cliente_Razon_Social;
        this.cliente_Direccion = cliente_Direccion;
        this.monto_Oper_Gravadas = monto_Oper_Gravadas;
        this.monto_Oper_Exoneradas = monto_Oper_Exoneradas;
        this.monto_Igv = monto_Igv;
        this.total_Impuestos = total_Impuestos;
        this.valor_Venta = valor_Venta;
        this.sub_Total = sub_Total;
        this.monto_Imp_Venta = monto_Imp_Venta;
        this.estado_Documento = estado_Documento;
        this.estado = estado;
        this.manual = manual;
        this.id_Base_Dato = id_Base_Dato;
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
            // "tipo_Operacion",
            // "tipo_Doc",
            // "serie",
            // "correlativo",
            // "tipo_Moneda",
            // "fecha_Emision",
            // "empresa_Ruc",
            // "cliente_Num_Doc",
            // "cliente_Razon_Social",
            // "valor_Venta",
            // "monto_Imp_Venta",
            // "estado_Documento",
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
        if (props.estado_Documento && !estadosValidos.includes(props.estado_Documento)) {
            return {
                success: false,
                message: `El estado de documento '${props.estado_Documento}' no es válido.`,
                factura: null
            };
        }

        return {
            success: true,
            message: "Factura creada exitosamente.",
            factura: new Factura(props),
        };
    }

    static formatearListado(props) {
        const propsFormateadas = props.map((prop) => {
            return {
                id: prop.id,
                tipo_operacion: prop.tipo_operacion,
                tipo_doc: prop.tipo_doc,
                serie: prop.serie,
                correlativo: prop.correlativo,
                tipo_moneda: prop.tipo_moneda,
                fecha_emision: prop.fecha_emision,
                empresa_ruc: prop.empresa_ruc,
                cliente_num_doc: prop.cliente_num_doc,
                cliente_razon_social: prop.cliente_razon_social,
                monto_igv: parseFloat(prop.monto_igv),
                total_impuestos: parseFloat(prop.total_impuestos),
                valor_venta: parseFloat(prop.valor_venta),
                sub_total: parseFloat(prop.sub_total),
                monto_imp_venta: parseFloat(prop.monto_imp_venta),
                estado: prop.estado,
            };
        });
        return propsFormateadas;
    }

    static formatearDetalles(props) {
        const propsFormateadas = props.map((prop) => {
            return {
                id: prop.dataValues.dataValues.id,
                factura_id: prop.dataValues.dataValues.factura_id,
                unidad: prop.dataValues.dataValues.unidad,
                cantidad: prop.dataValues.dataValues.cantidad,
                cod_Producto: prop.dataValues.dataValues.cod_Producto,
                descripcion: prop.dataValues.dataValues.descripcion,
                monto_Valor_Unitario: parseFloat(prop.dataValues.dataValues.monto_Valor_Unitario),
                monto_Base_Igv: parseFloat(prop.dataValues.dataValues.monto_Base_Igv),
                porcentaje_Igv: parseFloat(prop.dataValues.dataValues.porcentaje_Igv),
                igv: parseFloat(prop.dataValues.dataValues.igv),
                tip_Afe_Igv: prop.dataValues.dataValues.tip_Afe_Igv,
                total_Impuestos: parseFloat(prop.dataValues.dataValues.total_Impuestos),
                monto_Precio_Unitario: parseFloat(prop.dataValues.dataValues.monto_Precio_Unitario),
                monto_Valor_Venta: parseFloat(prop.dataValues.dataValues.monto_Valor_Venta),
                factor_Icbper: parseFloat(prop.dataValues.dataValues.factor_Icbper),
            };
        });
        return propsFormateadas;
    }

    static formatearFormasPago(props) {
        const propsFormateadas = props.map((prop) => {
            return {
                id: prop.dataValues.dataValues.id,
                factura_id: prop.dataValues.dataValues.factura_id,
                tipo: prop.dataValues.dataValues.tipo,
                monto: parseFloat(prop.dataValues.dataValues.monto),
                cuota: prop.dataValues.dataValues.cuota,
                fecha_pago: prop.dataValues.dataValues.fecha_pago,
            };
        });
        return propsFormateadas;
    }

    static formatearFactura(props) {
        const {
            id,
            tipo_Operacion,
            tipo_Doc,
            serie,
            correlativo,
            tipo_Moneda,
            fecha_Emision,
            empresa_Ruc,
            cliente_Tipo_Doc,
            cliente_Num_Doc,
            cliente_Razon_Social,
            cliente_Direccion,
            monto_Oper_Gravadas,
            monto_Oper_Exoneradas,
            monto_Igv,
            total_Impuestos,
            valor_Venta,
            sub_Total,
            monto_Imp_Venta,
            estado_Documento,
            manual,
            id_Base_Dato,
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
            factura_detalles = [],
            formas_pagos = [],
            leyendas = []
        } = props.dataValues;

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