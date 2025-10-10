const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Importamos la librería jsonwebtoken para generar el token
const { validarCaptcha } = require('../../../../shared/middlewares/captchaMiddleware'); // Importamos la función de validación del captcha
const Usuario = require("../../domain/entities/usuario"); // Importamos la entidad Usuario

module.exports = async (datoslogin, usuarioRepository ) => {
    const error = Usuario.validarLogin(datoslogin); // Validamos los campos obligatorios
    if (error) return { codigo: 401, respuesta: { mensaje: error } }; // Retornamos el error si hay alguno

    const { email, password, recaptchaToken } = datoslogin; // Desestructuramos los datos de login

    let captchaValido = false;
    captchaValido = await validarCaptcha(recaptchaToken); // Validamos el captcha
    if (!captchaValido) {
        return { codigo: 403, respuesta: { mensaje: "Captcha inválido" } }; // Retornamos el error si el captcha no es válido
    }

    const usuario = await usuarioRepository.obtenerPorEmail(email); // Buscamos el usuario por email

    if (!usuario) {
        return { codigo: 401, respuesta: { mensaje: "Credenciales inválidas" } }; // Retornamos el error si el usuario no existe
    }

    const passwordCorrecta = await bcrypt.compare(password, usuario.password); // Comparamos la contraseña ingresada con la almacenada en la base de datos
    if (!passwordCorrecta) {
        return { codigo: 401, respuesta: { mensaje: "Credenciales inválidas" } }; // Retornamos el error si la contraseña no es correcta
    }

    const cargoId = usuario.trabajador?.cargo_id;

    if (!cargoId) {
        return { codigo: 401, respuesta: { mensaje: "Credenciales inválidas" } }; // Retornamos el error si el usuario no tiene un cargo asociado
    }

    const cargoUsuario = await usuarioRepository.obtenerCargoPorId(cargoId);

    if (!cargoUsuario) {
        return { codigo: 401, respuesta: { mensaje: "Credenciales inválidas" } }; // Retornamos el error si el cargo no existe
    }


    const token = jwt.sign(
        { id: usuario.id, rol: cargoUsuario.nombre },
        process.env.JWT_SECRET, // Usamos la variable de entorno para la clave secreta del token
        { expiresIn: process.env.EXPIRE_IN } // El token expirará en 8 horas
    )

    return { codigo: 200, respuesta: { token, usuario: { id: usuario.id, nombre: usuario.trabajador.nombres+" "+usuario.trabajador.apellidos, email: usuario.email,id_chat:usuario.id_chat, rol: cargoUsuario.nombre } } }; // Retornamos el token y los datos del usuario

}