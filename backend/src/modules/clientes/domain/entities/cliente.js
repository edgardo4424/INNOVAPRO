class Cliente { 
    constructor(razon_social, tipo, ruc, dni, telefono, email, domicilio_fiscal, representante_legal, dni_representante, creado_por, cargo_representante, domicilio_representante) {
        this.razon_social = razon_social;
        this.tipo = tipo;
        this.ruc = ruc;
        this.dni = dni;
        this.telefono = telefono;
        this.email = email;
        this.domicilio_fiscal = domicilio_fiscal;
        this.representante_legal = representante_legal;
        this.dni_representante = dni_representante;
        this.creado_por = creado_por;
        this.cargo_representante = cargo_representante;
        this.domicilio_representante = domicilio_representante;
    }

    static validarCamposObligatorios(datos, modo = "crear") {
        const camposValidos = [
            "razon_social", "tipo", "ruc", "dni", "telefono", "email", "tipo_documento",
            "domicilio_fiscal", "representante_legal", "dni_representante", "creado_por", "cargo_representante", "domicilio_representante"
        ]
        
        if (modo === "crear") {
            if (!datos.razon_social || !datos.tipo) {
                
                return "Razón social y tipo de entidad son obligatorios.";
            }
            if (!datos.creado_por) {
                return "El campo 'creado_por' es obligatorio al registrar una nueva entidad.";
            }
        }

        if (modo === "editar") {
            const tieneAlMenosUnCampoValido = camposValidos.some(campo => {
                return datos[campo] !== undefined && datos[campo] !== null && datos[campo] !== "";
            });

            if (!tieneAlMenosUnCampoValido) {
                return "Debe proporcionar al menos un campo válido para actualizar.";
            }
        }

        return null;
    }

    static validarTipoEntidad(datos) {
        const { tipo, ruc, domicilio_fiscal, representante_legal, tipo_documento, dni_representante, dni } = datos;

        if (tipo === "Persona Jurídica") {
            if (!ruc || !domicilio_fiscal || !representante_legal || !tipo_documento || !dni_representante) {
                return "Los datos de la Persona Jurídica son obligatorios.";
            }
        } else if (tipo === "Persona Natural") {
            if (!dni) {
                return "El DNI es obligatorio para Personas Naturales.";
            }
        } else {
            return "Tipo de entidad inválido. Debe ser 'Persona Jurídica' o 'Persona Natural'.";
        }

        return null;
    }

    static construirDatosCliente(datos) {
        const base = {
            razon_social: datos.razon_social,
            tipo: datos.tipo,
            telefono: datos.telefono || "",
            email: datos.email || "",
            creado_por: datos.creado_por,
            obras_asociadas: datos.obras_asociadas || [],
            contactos_asociados: datos.contactos_asociados || [],
            cargo_representante: datos.cargo_representante || "",
            domicilio_representante: datos.domicilio_representante || ""
        }

        if (!base.email.trim()) delete base.email; // Eliminar el campo email si está vacío

        if (datos.tipo === "Persona Jurídica") {
            return {
                ...base,
                ruc: datos.ruc,
                domicilio_fiscal: datos.domicilio_fiscal,
                representante_legal: datos.representante_legal,
                tipo_documento: datos.tipo_documento,
                dni_representante: datos.dni_representante,
                ...(datos.dni?.trim() ? { dni: datos.dni.trim() } : {})
            }
        }

        if (datos.tipo === "Persona Natural") {
            return {
                ...base,
                dni: datos.dni,
                ruc: null,
                domicilio_fiscal: null,
                representante_legal: null,
                tipo_documento: datos.tipo_documento,
                dni_representante: null,
            }
        }

        return base; // Retorna los datos del cliente según el tipo de entidad
    }
}

module.exports = Cliente; // Exportamos la clase Cliente para su uso en otros módulos