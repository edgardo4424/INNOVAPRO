class AtributosValor { 
    constructor({
        despiece_id, 
        atributo_id, 
        valor, 
        numero_formulario_uso,
        zona
    }) {
        this.despiece_id = despiece_id;
        this.atributo_id = atributo_id;
        this.valor = valor;
        this.numero_formulario_uso = numero_formulario_uso;
        this.zona = zona;
    }

    static validarCamposObligatorios(datos, modo = "crear") {
        if (modo === "crear") {
            if (!datos.despiece_id || !datos.atributo_id || !datos.numero_formulario_uso || !datos.zona) {
                return "Faltan campos obligatorios: despiece_id, atributo_id, numero_formulario_uso y/o zona";
            }
    
        }

        if (modo === "editar") {
            const tieneAlMenosUnCampoValido = ["despiece_id","atributo_id", "valor", "numero_formulario_uso", "zona"].some(
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