class Obra { 
    constructor({
        nombre, 
        ubicacion, 
        direccion, 
        estado, 
        creado_por, 
        fecha_creacion, 
        fecha_actualizacion,
    }) {
        this.nombre = nombre;
        this.ubicacion = ubicacion;
        this.direccion = direccion;
        this.estado = estado;
        this.creado_por = creado_por;
        this.fecha_creacion = fecha_creacion;
        this.fecha_actualizacion = fecha_actualizacion
    }

    static validarCamposObligatorios(datos, modo = "crear") {
        if (modo === "crear") {
            if (!datos.nombre || !datos.ubicacion || !datos.direccion || !datos.estado) {
                return "Faltan campos obligatorios: nombre, ubicación, dirección y estado.";
            }
    
            if (!datos.creado_por) {
                return "El campo 'creado_por' es obligatorio al crear una obra.";
            }
        }

        if (modo === "editar") {
            const tieneAlMenosUnCampoValido = ["nombre", "ubicacion", "direccion", "estado"].some(
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

module.exports = Obra; // Exportamos la clase Obra para su uso en otros módulos