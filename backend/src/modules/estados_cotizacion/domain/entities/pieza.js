class EstadosCotizacion { 
    constructor({
        nombre,
        orden
    }) {
        this.nombre = nombre;
        this.orden = orden;
    }

    static validarCamposObligatorios(datos, modo = "crear") {
        if (modo === "crear") {
          
            if (!datos.nombre) {
                return "El nombre del estado de la cotización es obligatorio.";
            }
        }

        if (modo === "editar") {
            const tieneAlMenosUnCampoValido = ["nombre", "orden"].some(
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

module.exports = EstadosCotizacion; // Exportamos la clase Estados Cotizacion para su uso en otros módulos