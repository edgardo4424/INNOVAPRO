/**
 * Verifica si los campos mínimos obligatorios están presentes.
 * Aplica para cualquier entidad tipo Persona (cliente, proveedor, etc.)
 */
function validarCamposObligatorios(datos, modo = "crear") {
    const { razon_social, tipo, creado_por } = datos;

    if (!razon_social || !tipo) {
         throw ErrorPersonalizado("Razón social y tipo de entidad son obligatorios.",400);
    }

    // Solo al crear se exige creado_por
    if (modo === "crear" && !creado_por) {
        throw ErrorPersonalizado("El campo 'creado_por' es obligatorio al registrar una nueva entidad.", 400);
    }

    return null;
}

/**
 * Valida los campos requeridos según el tipo de entidad (Natural o Jurídica)
 */
function validarTipoEntidad(datos) {
    const { tipo, ruc, domicilio_fiscal, representante_legal, dni_representante, dni } = datos;

    if (tipo === "Persona Jurídica") {
        if (!ruc || !domicilio_fiscal || !representante_legal || !dni_representante) {
            throw ErrorPersonalizado('Los datos de la Persona Jurídica son obligatorios.', 400)
        }
    } else if (tipo === "Persona Natural") {
        if (!dni) {
            throw ErrorPersonalizado('El DNI es obligatorio para Personas Naturales.', 400)
        }
    } else {
        throw ErrorPersonalizado("Tipo de entidad inválido. Debe ser 'Persona Jurídica' o 'Persona Natural'.", 400)
    }

    return null;
}

/**
 * Valida los campos requeridos según el tipo de entidad (Natural o Jurídica)
 */
function validarTipoEntidad(datos) {
    const { tipo, ruc, domicilio_fiscal, representante_legal, dni_representante, dni } = datos;

    if (tipo === "Persona Jurídica") {
        if (!ruc || !domicilio_fiscal || !representante_legal || !dni_representante) {
            throw ErrorPersonalizado("Los datos de la Persona Jurídica son obligatorios.",400);
        }
    } else if (tipo === "Persona Natural") {
        if (!dni) {
            throw ErrorPersonalizado("El DNI es obligatorio para Personas Naturales.",400);
        }
    } else {
        throw ErrorPersonalizado("Tipo de entidad inválido. Debe ser 'Persona Jurídica' o 'Persona Natural'.",400);
    }

    return null;
}

const clienteCreateSchema = (data) => {
    const errorCampos = validarCamposObligatorios(data, "crear")
    const errorEntidad = validarTipoEntidad(data)
    if(!errorCampos && !errorEntidad) return data;
};

const clienteUpdateSchema = (data) => {
    const errorCampos = validarCamposObligatorios(data, "editar")
    const errorTipo = validarTipoEntidad(data)
    if(!errorCampos && !errorTipo) return data;
};

module.exports = {
    clienteCreateSchema,
    clienteUpdateSchema,
};