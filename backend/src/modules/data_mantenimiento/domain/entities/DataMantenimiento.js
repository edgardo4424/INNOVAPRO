const camposValidos = [
    "codigo",
    "nombre",
    "descripcion",
];

class DataMantenimiento { 
    constructor({
        codigo,
        nombre,
        descripcion,
    }) {
        this.codigo = codigo;
        this.nombre = nombre;
        this.descripcion = descripcion;
    }

    static validarCamposObligatorios(datos, modo = "crear") {
        if (modo === "crear") {
            if (!datos.codigo || !datos.nombre) {
                return "Faltan campos obligatorios: codigo o nombre del dato de mantenimiento.";
            }
        }

        if (modo === "editar") {
            const tieneAlMenosUnCampoValido = camposValidos.some(
                (campo) => 
                    datos[campo] !== undefined && 
                    datos[campo] !== null && 
                    datos[campo] !== ""
            );

            if (!tieneAlMenosUnCampoValido) {
                return "Debe proporcionar al menos un campo válido para actualizar.";
            }
        }

        return null
    }

}

module.exports = DataMantenimiento; 