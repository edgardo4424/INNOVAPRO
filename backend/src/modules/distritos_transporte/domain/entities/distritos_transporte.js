class DistritosTransporte { 
    constructor({
        nombre, 
        extra_camioneta, 
        extra_camion, 
    }) {
        this.nombre = nombre;
        this.extra_camioneta = extra_camioneta;
        this.extra_camion = extra_camion;
    }

    static validarCamposObligatorios(datos, modo = "crear") {
        if (modo === "crear") {
            if (!datos.nombre || !datos.extra_camioneta || !datos.extra_camion) {
                return "Faltan campos obligatorios: nombre, extra_camioneta, extra_camion.";
            }
        }

        if (modo === "editar") {
            const tieneAlMenosUnCampoValido = ["nombre", "extra_camioneta", "extra_camion"].some(
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

module.exports = DistritosTransporte; 