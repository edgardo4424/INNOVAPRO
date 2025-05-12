class Pieza { 
    constructor({
        item, 
        descripcion
    }) {
        this.descripcion = descripcion;
    }

    static validarCamposObligatorios(datos, modo = "crear") {
        if (modo === "crear") {
    
            if (!datos.descripcion) {
                return "El campo 'descripcion' es obligatorio al crear un uso.";
            }
        }

        if (modo === "editar") {
            const tieneAlMenosUnCampoValido = ["item", "familia_id", "descripcion", "peso_kg","precio_venta_dolares", "precio_venta_soles","precio_alquiler_soles", "stock_actual"].some(
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

module.exports = Pieza; // Exportamos la clase Pieza para su uso en otros módulos