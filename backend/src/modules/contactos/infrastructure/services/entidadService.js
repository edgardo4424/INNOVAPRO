const { Op } = require("sequelize");

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

module.exports = { verificarDuplicados }; // Exporta la función para que pueda ser utilizada en otros módulos 
