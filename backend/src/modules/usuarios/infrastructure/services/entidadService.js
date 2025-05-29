const bcrypt = require("bcryptjs");

/**
 * Prepara un usuario para ser almacenada en la base de datos
 * Hashea la contraseña y devuelve el objeto listo para guardar
 */
async function prepararUsuarioParaGuardar(datos) {
  const hashedPassword = await bcrypt.hash(datos.password, 10); // Hashea la contraseña
  return {
    nombre: datos.nombre,
    email: datos.email,
    password: hashedPassword,
    rol: datos.rol,
    telefono: datos.telefono
  };
}

module.exports = {
  prepararUsuarioParaGuardar, // Exporta la función para que pueda ser utilizada en otros módulos
};
