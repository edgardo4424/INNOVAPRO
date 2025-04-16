const { Op } = require("sequelize");

/**
 * Verifica si los campos mínimos obligatorios están presentes.
 */
function validarCamposObligatorios(datos, modo = "crear") {
  const { nombre, email, rol, password } = datos;

  // Validacion al crear siempre tiene que enviar el password

  if ((modo == "crear")) {
    if (!password) {
      return "Ingresar password";
    }

    // Validar contraseña segura
    const regexPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    if (!regexPassword.test(password)) {
      return "La contraseña debe tener al menos 8 caracteres, incluir una mayúscula, una minúscula y un número.";
    }
  }

  // Validacion de editar
  // Validación de campos vacíos
  if (!nombre || !email || !rol) {
    return "Todos los campos son obligatorios";
  }

  // Validar formato de nombre
  const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/;
  if (!regexNombre.test(nombre)) {
    return "Nombre solo debe contener letras";
  }

  // Validar formato de correo
  if (!/\S+@\S+\.\S+/.test(email)) {
    return "Formato de correo inválido";
  }

  // Validar rol
  const rolesPermitidos = [
    "Gerencia",
    "Ventas",
    "Oficina Técnica",
    "Almacén",
    "Administración",
    "Clientes",
  ];

  if (!rolesPermitidos.includes(rol)) {
    return "Rol no permitido";
  }

  return null;
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

  if (datos.ruc && datos.ruc.trim())
    condiciones.push({ ruc: datos.ruc.trim() });
  if (datos.dni && datos.dni.trim())
    condiciones.push({ dni: datos.dni.trim() });
  if (datos.dni_representante && datos.dni_representante.trim())
    condiciones.push({ dni_representante: datos.dni_representante.trim() });
  if (datos.email && datos.email.trim())
    condiciones.push({ email: datos.email.trim() });

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

  if (
    datos.dni_representante &&
    duplicado.dni_representante === datos.dni_representante
  )
    mensaje += "El DNI del representante ya está registrado. ";

  if (datos.ruc && duplicado.ruc === datos.ruc)
    mensaje += "El RUC ingresado ya está registrado. ";

  if (datos.email && duplicado.email === datos.email)
    mensaje += "El correo ingresado ya está registrado. ";

  return mensaje.trim();
}

module.exports = {
  validarCamposObligatorios,
  verificarDuplicados,
};
