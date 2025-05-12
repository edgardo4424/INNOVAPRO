class Pieza { 
    constructor({
        item, 
        familia_id, 
        descripcion, 
        peso_kg, 
        precio_venta_dolares,
        precio_venta_soles, 
        precio_alquiler_soles, 
        stock_actual,
    }) {
        this.item = item;
        this.familia_id = familia_id;
        this.descripcion = descripcion;
        this.peso_kg = peso_kg;
        this.precio_venta_dolares = precio_venta_dolares;
        this.precio_venta_soles = precio_venta_soles;
        this.precio_alquiler_soles = precio_alquiler_soles;
        this.stock_actual = stock_actual
    }

    static validarCamposObligatorios(datos, modo = "crear") {
        if (modo === "crear") {
            if (!datos.item || !datos.descripcion || !datos.peso_kg || !datos.precio_venta_dolares || !datos.precio_venta_soles || !datos.precio_alquiler_soles || !datos.stock_actual) {
                return "Faltan campos obligatorios: item, familia, descripción, peso kg, precio venta dolares, precio venta soles, precio alquiler soles y stock actual.";
            }
    
            if (!datos.familia_id) {
                return "El campo 'familia_id' es obligatorio al crear una pieza.";
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