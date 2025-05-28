class Cotizacion { 
    constructor({
        despiece_id, 
        contacto_id, 
        cliente_id, 
        obra_id, 
        filial_id,
        usuario_id, 
        tiene_transporte, 
        tiene_instalacion,
        transporte_id,
        instalacion_id,
        estado_cotizacion,
        tiempo_alquiler_dias,
        codigo_documento
    }) {
        this.despiece_id = despiece_id;
        this.contacto_id = contacto_id;
        this.cliente_id = cliente_id;
        this.obra_id = obra_id;
        this.filial_id = filial_id;
        this.usuario_id = usuario_id;
        this.tiene_transporte = tiene_transporte;
        this.tiene_instalacion = tiene_instalacion;
        this.transporte_id = transporte_id;
        this.instalacion_id = instalacion_id;
        this.estado_cotizacion = estado_cotizacion;
        this.tiempo_alquiler_dias = tiempo_alquiler_dias;
        this.codigo_documento = codigo_documento;
    }

    static validarCamposObligatorios(datos, modo = "crear") {

        if (!datos.tipo_cotizacion) return 'El tipo de cotización es obligatorio';
        if (!["Venta", "Alquiler"].includes(datos.tipo_cotizacion)) return 'Tipo de cotización inválido';

        if (modo === "crear") {
            if (!datos.despiece_id || !datos.contacto_id || !datos.cliente_id || !datos.obra_id || !datos.filial_id || !datos.usuario_id || !datos.tiene_transporte || !datos.tiene_instalacion || !datos.transporte_id || !datos.instalacion_id || !datos.estado_cotizacion || !datos.codigo_documento) {
                return "Faltan campos obligatorios: despiece_id, contacto_id, cliente_id, obra_id, filial_id, usuario_id, tiene_transporte, tiene_instalacion, instalacion_id, estado_cotizacion, codigo_documento";
            }
        }

        if (modo === "editar") {
            const tieneAlMenosUnCampoValido = ["despiece_id", "contacto_id", "cliente_id", "obra_id","filial_id", "usuario_id","tiene_transporte", "tiene_instalacion", "instalacion_id", "estado_cotizacion", "tiempo_alquiler_dias", "codigo_documento"].some(
                (campo) => 
                    datos[campo] !== undefined && 
                    datos[campo] !== null && 
                    datos[campo] !== ""
            );

            if (!tieneAlMenosUnCampoValido) {
                return "Debe proporcionar al menos un campo válido para actualizar.";
            }
        }

        return null;
    }

}

module.exports = Cotizacion; // Exportamos la clase Pieza para su uso en otros módulos