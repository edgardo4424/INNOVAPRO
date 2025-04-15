const usuarioRepository = require("./usuario.repository");
const rolRepository = require("../rol/rol.repository");
const jwt = require("jsonwebtoken");
const { ErrorPersonalizado } = require("../../utils/errorPersonalizado");
const { encriptarPassword, validarPassword } = require("../../utils/password");
const { generarToken } = require("../../utils/jwt");
const { validarCaptcha } = require("../../middlewares/captchaMiddleware");
/*
  En el caso de uso decide qué datos son sensibles y deben ocultarse.
*/

exports.crearUsuario = async (data) => {
  // 🛡️ Verificar si ya existe un usuario con el mismo email
  const usuarioExistente = await usuarioRepository.findByEmail(data.email);
  if (usuarioExistente)
    throw ErrorPersonalizado(
      "Ya existe un usuario con ese correo electrónico",
      409
    );

  // 🔐 Encriptar la contraseña antes de guardar
  const passwordHasheado = await encriptarPassword(data.password);

  // 📦 Preparar el objeto con la contraseña encriptada
  const dataUsuario = {
    ...data,
    password: passwordHasheado,
  };

  // 💾 Guardar el nuevo usuario en la base de datos (devuelve instancia Sequelize)
  const nuevoUsuario = await usuarioRepository.create(dataUsuario);

  // 🧹 Remover la contraseña antes de retornar al frontend
  const { password, ...restoDatosUsuario } = nuevoUsuario;
  return restoDatosUsuario;
};

exports.actualizarUsuario = async ({ id, data }) => {

  // 🛡️ Verificar si el nuevo email ya lo tiene otro usuario
  const usuarioExistente = await usuarioRepository.findById(id);

  console.log(usuarioExistente);
  if(!usuarioExistente) throw ErrorPersonalizado('No se encontró usuario', 404)
  
  if (usuarioExistente.id != id) {
    throw ErrorPersonalizado('Ya existe un usuario con ese correo electrónico', 409);
  }

  // 💾 Actualizar el nuevo usuario
  const usuarioActualizado = await usuarioRepository.update({ id, data });

  console.log("usuarioActualizado", usuarioActualizado);
  // 🧹 Remover la contraseña antes de retornar al frontend
  const { password, ...restoDatosUsuario } = usuarioActualizado;
  return restoDatosUsuario;
};

exports.obtenerUsuarios = async () => {
  const usuarios = await usuarioRepository.findAll();

  console.log("usuarioos", usuarios);

  // 🧹 Remover las contraseñas antes de retornar al frontend
  const usuariosSinPassword = usuarios.map(({ password, ...resto }) => resto);

  return usuariosSinPassword;
};

exports.obtenerUnUsuario = async ({ id }) => {
  const usuario = await usuarioRepository.findById(id);

  if (!usuario) throw ErrorPersonalizado("Usuario no existe", 404);

  // 🧹 Remover las contraseña antes de retornar al frontend
  const { password, ...usuarioEncontrado } = usuario;

  return usuarioEncontrado;
};

exports.eliminarUsuario = async ({ id }) => {
  return await usuarioRepository.delete(id);
};

exports.loginUsuario = async ({ email, password, recaptchaToken }) => {

   // 🔹 Validar captcha de Google
  /*  const captchaValido = await validarCaptcha(recaptchaToken);
   if (!captchaValido) {
    throw ErrorPersonalizado("Falló la validación de reCAPTCHA.", 400)
   } */

  // 🔍 Buscar usuario con sus roles y módulos
  const {usuario, permisos, modulos} = await usuarioRepository.findByEmailWithRolAndModulosAndPermisos(email);

  console.log('usuarioooooooooooooooooo', usuario);
  // ⚠️ Verificar existencia del usuario
  if (!usuario) throw ErrorPersonalizado("Credenciales inválidas", 401);

  // 🔐 Validar contraseña ingresada contra la guardada
  const esValidoPassword = await validarPassword(password, usuario.password);
  if (!esValidoPassword)
    throw ErrorPersonalizado("Credenciales inválidas", 401);

  

  // 🎫 Generar token JWT
  return generarToken({
    id: usuario.id,
    email: usuario.email,
    rol: usuario.Rol.nombre,
    permisos,
    modulos
  });
};

exports.regenerarTokenCondicional = async (decodedToken) => {
  const {usuario, permisos, modulos} = await usuarioRepository.findByEmailWithRolAndModulosAndPermisos(
    decodedToken.email
  );
  if (!usuario) throw ErrorPersonalizado("Usuario no encontrado", 404);

  const rol = await rolRepository.findById(usuario.Rol.id);

  const rolActualizado =
    new Date(rol.updatedAt) > new Date(decodedToken.iat * 1000);
  const ahora = Math.floor(Date.now() / 1000);
  const expiracionProxima = decodedToken.exp - ahora < 600;

  if (rolActualizado || expiracionProxima) {
    const modulos = usuario.Rol?.Modulos?.map((m) => m.nombre) || [];
    return generarToken({
      id: usuario.id,
      email: usuario.email,
      rol: usuario.Rol.nombre,
      modulos,
    });
  }
  return null;
};

exports.obtenerModulosPermisosPorUsuario = async() => {

  // Obtener modulos

  // Obtener permisos
}