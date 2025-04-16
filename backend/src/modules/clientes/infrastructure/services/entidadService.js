const { Op } = require("sequelize");

/**
 * Verifica si los campos mínimos obligatorios están presentes.
 * Aplica para cualquier entidad tipo Persona (cliente, proveedor, etc.)
 */
function validarCamposObligatorios(datos, modo = "crear") {
    const camposValidos = [
      "razon_social",
      "tipo",
      "ruc",
      "dni",
      "telefono",
      "email",
      "domicilio_fiscal",
      "representante_legal",
      "dni_representante",
      "creado_por"
    ];
  
    if (modo === "crear") {
      const { razon_social, tipo, creado_por } = datos;
      if (!razon_social || !tipo) {
        return "Razón social y tipo de entidad son obligatorios.";
      }
      if (!creado_por) {
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
  



/**
 * Valida los campos requeridos según el tipo de entidad (Natural o Jurídica)
 */
function validarTipoEntidad(datos) {
    const { tipo, ruc, domicilio_fiscal, representante_legal, dni_representante, dni } = datos;

    if (tipo === "Persona Jurídica") {
        if (!ruc || !domicilio_fiscal || !representante_legal || !dni_representante) {
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
          // ✅ solo incluye dni si fue enviado explícitamente
          ...(datos.dni && datos.dni.trim() ? { dni: datos.dni.trim() } : {})
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

/**
 * Verifica si existe algún duplicado en base a campos únicos (DNI, RUC, Email, etc.)
 * @param {Model} modelo - Modelo Sequelize (ej: db.clientes, db.empresas_proveedoras)
 * @param {Object} datos - Datos recibidos
 * @param {number|null} excludeId - ID a excluir cuando estás actualizando
 */
async function verificarDuplicados(modelo, datos = {}, excludeId = null) {
    

    if (!modelo || typeof modelo.findOne !== "function") {
      throw new Error("Modelo no válido para verificación de duplicados.");
    }

    const condiciones = [];
  
    if (datos.ruc && datos.ruc.trim()) condiciones.push({ ruc: datos.ruc.trim() });
    if (datos.dni && datos.dni.trim()) condiciones.push({ dni: datos.dni.trim() });
    if (datos.dni_representante && datos.dni_representante.trim()) condiciones.push({ dni_representante: datos.dni_representante.trim() });
    if (datos.email && datos.email.trim()) condiciones.push({ email: datos.email.trim() });

  
    if (condiciones.length === 0) {
        return null;
    }
  
    const where = { [Op.or]: condiciones };
    if (excludeId) {
      where.id = { [Op.ne]: excludeId };
    }
    
    const duplicado = await modelo.findOne({ where });
    if (!duplicado) return null;
  
    let mensaje = "Error: ";
  
    if (datos.dni && duplicado.dni === datos.dni)
      mensaje += "El DNI ingresado ya está registrado. ";
  
    if (datos.dni_representante && duplicado.dni_representante === datos.dni_representante)
      mensaje += "El DNI del representante ya está registrado. ";
  
    if (datos.ruc && duplicado.ruc === datos.ruc)
      mensaje += "El RUC ingresado ya está registrado. ";
  
    if (datos.email && duplicado.email === datos.email)
      mensaje += "El correo ingresado ya está registrado. ";
  
    return mensaje.trim();
  }

module.exports = {
    validarCamposObligatorios,
    validarTipoEntidad,
    construirEntidadData,
    verificarDuplicados,
};
