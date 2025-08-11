class Borrador{
    constructor({
        tipo_borrador,
        serie,
        correlativo,
        empresa_ruc,
        cliente_num_doc,
        cliente_razon_social,
        fecha_Emision,
        body,
        usuario_id,
    }){
        this.tipo_borrador = tipo_borrador;
        this.serie = serie;
        this.correlativo = correlativo;
        this.empresa_ruc = empresa_ruc;
        this.cliente_num_doc = cliente_num_doc;
        this.cliente_razon_social = cliente_razon_social;
        this.fecha_Emision = fecha_Emision;
        this.body = body;
        this.usuario_id = usuario_id;
    }

    static crear(props){
        const camposRequeridos = [
            "tipo_borrador",
            "serie",
            "correlativo",
            "empresa_ruc",
            "cliente_num_doc",
            "cliente_razon_social",
            "fecha_Emision",
            "body",
            "usuario_id",
        ];
        for (const campo of camposRequeridos) {
            if (!props[campo]) {
                return {
                    success: false,
                    message: `El campo '${campo}' es requerido para crear la factura.`,
                    data: null
                };
            }
        }
        return {
            success: true,
            message: "Campos de factura válidos para creación.",
            data: new Borrador(props),
        };
    }
}

module.exports = Borrador;