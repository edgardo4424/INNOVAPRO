class CotizacionesTransporte { 
    constructor({
        cotizacion_id, 
        uso_id, 
        /* distrito_transporte_id,  */
        distrito_transporte, 
        tarifa_transporte_id, 
        tipo_transporte, 
        unidad, 
        cantidad,
        costo_tarifas_transporte,
        costo_pernocte_transporte,
        costo_distrito_transporte,
        costo_total
    }) {
        this.cotizacion_id = cotizacion_id;
        this.uso_id = uso_id;
        /* this.distrito_transporte_id = distrito_transporte_id; */
        this.distrito_transporte = distrito_transporte;
        this.tarifa_transporte_id = tarifa_transporte_id;
        this.tipo_transporte = tipo_transporte;
        this.unidad = unidad;
        this.cantidad = cantidad;
        this.costo_tarifas_transporte = costo_tarifas_transporte;
        this.costo_pernocte_transporte = costo_pernocte_transporte;
        this.costo_distrito_transporte = costo_distrito_transporte;
        this.costo_total = costo_total
    }

    static validarCamposObligatorios(datos, modo = "crear") {
        if (modo === "crear") {
            if (!datos.cotizacion_id || !datos.uso_id || !datos.tarifa_transporte_id || !datos.tipo_transporte || !datos.unidad || !datos.cantidad || !datos.costo_tarifas_transporte || !datos.costo_pernocte_transporte || !datos.costo_distrito_transporte || !datos.costo_total) {
                return "Faltan campos obligatorios: cotizacion_id, uso_id, tarifa_transporte_id, tipo_transporte, unidad, cantidad, costo_tarifas_transporte, costo_pernocte_transporte, costo_distrito_transporte y costo_total.";
            }
        }

        if (modo === "editar") {
            const tieneAlMenosUnCampoValido = ["cotizacion_id", "uso_id", "distrito_transporte", "tarifa_transporte_id", "tipo_transporte", "unidad", "cantidad", "costo_tarifas_transporte", "costo_pernocte_transporte", "costo_distrito_transporte", "costo_total"].some(
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

module.exports = CotizacionesTransporte; 