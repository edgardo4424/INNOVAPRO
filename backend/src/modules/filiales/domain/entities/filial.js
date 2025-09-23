const camposValidos = [
    "razon_social",
    "ruc",
    "direccion",
    "representante_legal",
    "tipo_documento",
    "dni_representante",
    "cargo_representante",
    "telefono_representante",
    "telefono_oficina",
    "creado_por",
];

class Filial { 
    constructor({
        razon_social,
        ruc,
        direccion,
        representante_legal, 
        tipo_documento,
        dni_representante, 
        cargo_representante, 
        telefono_representante, 
        telefono_oficina, 
        creado_por
    }) {
        this.razon_social = razon_social;
        this.ruc = ruc;
        this.direccion = direccion;
        this.representante_legal = representante_legal;
        this.tipo_documento = tipo_documento;
        this.dni_representante = dni_representante;
        this.cargo_representante = cargo_representante;
        this.telefono_representante = telefono_representante;
        this.telefono_oficina = telefono_oficina;
        this.creado_por = creado_por;
    }

    static validarCamposObligatorios(datos, modo = "crear") {
        if (modo === "crear") {
            if (!datos.razon_social || !datos.ruc || !datos.representante_legal || !datos.tipo_documento || !datos.dni_representante) {
                return "Faltan campos obligatorios: razón social, ruc, representante legal, tipo de documento y/o número de documento representante.";
            }
    
            if (!datos.creado_por) {
                return "El campo 'creado_por' es obligatorio al crear una filial.";
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

module.exports = Filial; // Exportamos la clase filial para su uso en otros módulos