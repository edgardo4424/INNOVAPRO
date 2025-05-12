class AtributosValor { 
    constructor({
        despiece_id, 
        atributo_id, 
        valor, 
    }) {
        this.despiece_id = despiece_id;
        this.atributo_id = atributo_id;
        this.valor = valor;
    }

    static validarCamposObligatorios(datos, modo = "crear") {
        if (modo === "crear") {
            if (!datos.despiece_id || !datos.atributo_id) {
                return "Faltan campos obligatorios: despiece_id y atributo_id";
            }
    
        }

        if (modo === "editar") {
            const tieneAlMenosUnCampoValido = ["despiece_id", "pieza_id", "cantidad", "peso_kg", "precio_venta_dolares", "precio_venta_soles", "precio_alquiler_soles"].some(
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

module.exports = AtributosValor; // Exportamos la clase Despiece Detalle para su uso en otros módulos