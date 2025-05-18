class TarifasTransporte { 
    constructor({
        grupo_tarifa, 
        subtipo, 
        tipo_transporte, 
        unidad, 
        rango_desde, 
        rango_hasta, 
        precio_soles,
    }) {
        this.grupo_tarifa = grupo_tarifa;
        this.subtipo = subtipo;
        this.tipo_transporte = tipo_transporte;
        this.unidad = unidad;
        this.rango_desde = rango_desde;
        this.rango_hasta = rango_hasta;
        this.precio_soles = precio_soles
    }

    static validarCamposObligatorios(datos, modo = "crear") {
        if (modo === "crear") {
            if (!datos.grupo_tarifa || !datos.subtipo || !datos.tipo_transporte || !datos.unidad || !datos.rango_desde || !datos.rango_hasta || !datos.precio_soles) {
                return "Faltan campos obligatorios: grupo_tarifa, subtipo, tipo_transporte, unidad, rango_desde, rango_hasta y precio_soles.";
            }
        }

        if (modo === "editar") {
            const tieneAlMenosUnCampoValido = ["grupo_tarifa", "subtipo", "tipo_transporte", "unidad", "rango_desde", "rango_hasta", "precio_soles"].some(
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

module.exports = TarifasTransporte; 