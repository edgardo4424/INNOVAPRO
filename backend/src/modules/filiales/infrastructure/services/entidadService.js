const { Op } = require("sequelize");

/**
 * Verifica si los campos mínimos obligatorios están presentes.
 */
function validarCamposObligatorios(datos) {
  const {
    razon_social,
    ruc,
    direccion,
    representante_legal,
    dni_representante,
    cargo_representante,
    telefono_representante,
    telefono_oficina,
    creado_por,
  } = datos;

  // Validacion de editar
  // Validación de campos vacíos
  if (
    !razon_social ||
    !ruc ||
    !direccion ||
    !representante_legal ||
    !dni_representante ||
    !cargo_representante ||
    !creado_por
  ) {
    return "Todos los campos son obligatorios";
  }

  return null;
}

/**
 * Verifica si existe algún duplicado en base a campos únicos (DNI, RUC, Email, etc.)
 * @param {Model} modelo - Modelo Sequelize (ej: db.clientes, db.empresas_proveedoras)
 * @param {Object} datos - Datos recibidos
 * @param {number|null} excludeId - ID a excluir cuando estás actualizando
 */
async function verificarDuplicadosRUC(modelo, datos = {}, excludeId = null) {
  
  if (!modelo || typeof modelo.findOne !== "function") {
    throw new Error("Modelo no válido para verificación de duplicados.");
  }
  const empresaExistente = await modelo.findOne({
    where: {
      ruc: datos.ruc,
      id: { [Op.ne]: excludeId }, // Excluye la empresa actual
    },
  });

  if(empresaExistente) {
    return "El RUC ingresado ya está registrado en otra empresa."
  }

  return null
}

module.exports = {
  validarCamposObligatorios,
  verificarDuplicadosRUC,
};
