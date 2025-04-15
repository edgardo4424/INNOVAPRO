// Validar/preparar datos antes de insertar en la BD

/**
 * Construye los datos correctos según el tipo de entidad
 */
function construirEntidadData(datos) {
    const {
        razon_social, tipo, ruc, dni,
        domicilio_fiscal, representante_legal, dni_representante,
        telefono, email, creado_por
    } = datos;

    let base = {
        razon_social,
        tipo,
        telefono: telefono || "",
        email: email || "",
        creado_por,
    };

    if (!email || email.trim() === "") {
        delete base.email;
    }

    if (tipo === "Persona Jurídica") {
        return {
            ...base,
            ruc,
            domicilio_fiscal,
            representante_legal,
            dni_representante,
            dni: null,
        };
    }

    if (tipo === "Persona Natural") {
        return {
            ...base,
            dni,
            ruc: null,
            domicilio_fiscal: null,
            representante_legal: null,
            dni_representante: null,
        };
    }

    return base;
}