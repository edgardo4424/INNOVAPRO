const usuarioRepository = require("../repositories/usuario.repository");
const rolRepository = require("../repositories/rol.repository");
const jwt = require("jsonwebtoken");
const { ErrorPersonalizado } = require("../utils/errorPersonalizado");
const { encriptarPassword, validarPassword } = require("../utils/password");
const { generarToken } = require("../utils/jwt");
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

exports.obtenerUsuarios = async () => {
  const usuarios = await usuarioRepository.findAll();

  // 🧹 Remover las contraseñas antes de retornar al frontend
  const usuariosSinPassword = usuarios.map(({ password, ...resto }) => resto);

  return usuariosSinPassword;
};

exports.loginUsuario = async ({ email, password }) => {
  // 🔍 Buscar usuario con sus roles y módulos
  const usuario = await usuarioRepository.findByEmailWithRolAndModulos(email);

  // ⚠️ Verificar existencia del usuario
  if (!usuario) throw ErrorPersonalizado("Credenciales inválidas", 401);

  // 🔐 Validar contraseña ingresada contra la guardada
  const esValidoPassword = await validarPassword(password, usuario.password);
  if (!esValidoPassword)
    throw ErrorPersonalizado("Credenciales inválidas", 401);

  // 🔓 Extraer los módulos asignados al rol
  const modulos = usuario.Rol?.Modulos?.map((m) => m.nombre) || [];

  // 🎫 Generar token JWT
  return generarToken({
    id: usuario.id,
    email: usuario.email,
    rol: usuario.Rol.nombre,
    modulos
  });
};

exports.regenerarTokenCondicional = async (decodedToken) => {

  const usuario = await usuarioRepository.findByEmailWithRolAndModulos(
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
      modulos
    });
  }
  return null;
};
