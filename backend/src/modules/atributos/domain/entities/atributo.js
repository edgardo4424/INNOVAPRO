class Atributo { 
    constructor({
        uso_id, 
        nombre, 
        tipo_dato, 
        unidad_medida, 
        orden,
    }) {
        this.uso_id = uso_id;
        this.nombre = nombre;
        this.tipo_dato = tipo_dato;
        this.unidad_medida = unidad_medida;
        this.orden = orden;
    }

    static validarCamposObligatorios(datos, modo = "crear") {
        if (modo === "crear") {
            if (!datos.uso_id || !datos.nombre || !datos.tipo_dato) {
                return "Faltan campos obligatorios: uso_id, nombre, descripción y tipo_dato";
            }
        }

        if (modo === "editar") {
            const tieneAlMenosUnCampoValido = ["uso_id", "nombre", "tipo_dato"].some(
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

module.exports = Atributo; // Exportamos la clase Atributo para su uso en otros módulos