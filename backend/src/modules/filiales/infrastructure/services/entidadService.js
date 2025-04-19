const { Op } = require("sequelize");

async function verificarDuplicadosRUC(modelo, datos = {}, excludeId = null) {
  
  if (!modelo || typeof modelo.findOne !== "function") {
    throw new Error("Modelo no válido para verificación de duplicados.");
  }

  if (!datos.ruc) return null; // 🔥 No validamos duplicado si no hay RUC

  const empresaExistente = await modelo.findOne({
    where: {
      ruc: datos.ruc,
      id: { [Op.ne]: excludeId }, // Excluye la empresa actual
    },
  });

  if (!empresaExistente) return null;

  return "El RUC ingresado ya está registrado.";

}

module.exports = { verificarDuplicadosRUC }; // Exporta la función para que pueda ser utilizada en otros módulos