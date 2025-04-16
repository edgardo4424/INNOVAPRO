const bcrypt = require("bcryptjs");

module.exports = async (usuarioData, usuarioRepository, entidadService) => {

  const errorCampos = entidadService.validarCamposObligatorios(usuarioData, "crear");
  
  if (errorCampos) return { codigo: 400, respuesta: { mensaje: errorCampos } }; // Validamos campos obligatorios

  // Verificar si el correo ya está en uso
  const usuarioExistente = await usuarioRepository.obtenerPorEmail(usuarioData.email);
 
  if (usuarioExistente) {
    return { codigo: 400, respuesta: { mensaje: "El correo ya está registrado" } }
  }

   // Encriptar contraseña
   const hashedPassword = await bcrypt.hash(usuarioData.password, 10);

   const nuevoUsuarioData = {
     nombre: usuarioData.nombre,
     email: usuarioData.email,
     password: hashedPassword,
     rol: usuarioData.rol
   }
  
  const nuevoUsuario = await usuarioRepository.crear(nuevoUsuarioData); // Creamos el nuevo usuario con todos sus datos en la base de datos

  return { codigo: 201, respuesta: { mensaje: "Usuario creado exitosamente", usuario: nuevoUsuario } } // Retornamos el cliente creado
  
}; // Exporta la función para que pueda ser utilizada en otros módulos
