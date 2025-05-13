class PiezasUsos { 
    constructor({
        pieza_id, 
        uso_id
    }) {
        this.pieza_id = pieza_id;
        this.uso_id = uso_id
    }

    static validarCamposObligatorios(datos, modo = "crear") {
        if (modo === "crear") {
            if (!datos.pieza_id || !datos.uso_id) {
                return "Faltan campos obligatorios: pieza_id y uso_id.";
            }
        }

        if (modo === "editar") {
            const tieneAlMenosUnCampoValido = ["pieza_id", "familia_id"].some(
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

module.exports = PiezasUsos; // Exportamos la clase PiezasUsos para su uso en otros módulos