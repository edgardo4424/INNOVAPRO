class DespieceDetalle { 
    constructor({
        despiece_id, 
        pieza_id, 
        cantidad, 
        peso_kg, 
        precio_venta_dolares, 
        precio_venta_soles, 
        precio_alquiler_soles,
      esAdicional
    }) {
        this.despiece_id = despiece_id;
        this.pieza_id = pieza_id;
        this.cantidad = cantidad;
        this.peso_kg = peso_kg;
        this.precio_venta_dolares = precio_venta_dolares;
        this.precio_venta_soles = precio_venta_soles;
        this.precio_alquiler_soles = precio_alquiler_soles;
        this.esAdicional = esAdicional;
    }

    static validarCamposObligatorios(datos, modo = "crear") {
       
        if (modo === "crear") {
            
            if (!datos.despiece_id || !datos.pieza_id || !datos.cantidad || !datos.peso_kg) {
                return "Faltan campos obligatorios: despiece_id, pieza_id, cantidad, peso_kg";
            }
    
        }

        if (modo === "editar") {
            const tieneAlMenosUnCampoValido = ["despiece_id", "pieza_id", "cantidad", "peso_kg", "precio_venta_dolares", "precio_venta_soles", "precio_alquiler_soles", "esAdicional"].some(
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

module.exports = DespieceDetalle; // Exportamos la clase Despiece Detalle para su uso en otros módulos