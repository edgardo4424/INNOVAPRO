const db = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const { validarCaptcha } = require("../middlewares/captchaMiddleware");

// 🔹 Login de usuario
exports.login = async (req, res) => {
    try {
        const { email, password, recaptchaToken } = req.body;
        console.log("📩 Recibido en backend:", req.body);

        if (!/\S+@\S+\.\S+/.test(email)) {
            return res.status(400).json({ error: "Formato de correo inválido" });
        }

        if (!email || !password || !recaptchaToken){
            return res.status(400).json({ mensaje: "❌ Todos los campos son obligatorios, incluyendo reCAPTCHA."});
        }

        // 🔹 Validar captcha de Google
        const captchaValido = await validarCaptcha(recaptchaToken);
        if (!captchaValido) {
        return res.status(400).json({ mensaje: "❌ Falló la validación de reCAPTCHA." });
        }

        // 🔹 Verificar usuario en la base de datos

        const usuario = await db.usuarios.findOne({ where: { email } });

        if (!usuario) {
            console.warn("❌ Intento de login con correo no registrado:", email);
            return res.status(401).json({ mensaje: "Credenciales incorrectas" });
        }

        const esValido = bcrypt.compareSync(password, usuario.password);
        if (!esValido) {
            console.warn("❌ Intento de login con contraseña incorrecta para:", email);
            return res.status(401).json({ mensaje: "Credenciales incorrectas" });
        }

        // 🔹 Generar token JWT
        
        const token = jwt.sign(
            { id: usuario.id, rol: usuario.rol },
            process.env.JWT_SECRET || "clave_por_defecto",
            { expiresIn: "8h" }
        );

        console.log("🟢 Login exitoso para:", usuario.nombre);
        res.status(200).json({ token, usuario: { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol } });

    } catch (error) {
        console.error("🔥 Error en login:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

// 🔹 Obtener todos los usuarios
exports.obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await db.usuarios.findAll({
            attributes: ["id", "nombre", "email", "rol"]
        });

        res.status(200).json({ usuarios: usuarios || [] }); // 🔥 Siempre devuelve un array, aunque esté vacío
    } catch (error) {
        console.error("🔥 Error al obtener usuarios:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

// 🔹 Crear un nuevo usuario
exports.crearUsuario = async (req, res) => {
    try {
        const { nombre, email, password, rol } = req.body;

        // Validación de campos vacíos
        if (!nombre || !email || !password || !rol) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        // Validar formato de nombre
        const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/;
        if (!regexNombre.test(nombre)) {
        return res.status(400).json({ error: 'Nombre solo debe contener letras' });
        }

        // Validar formato de correo
        if (!/\S+@\S+\.\S+/.test(email)) {
            return res.status(400).json({ error: 'Formato de correo inválido' });
        }

        // Verificar si el correo ya está en uso
        const usuarioExistente = await db.usuarios.findOne({ where: { email } });
        if (usuarioExistente) {
            return res.status(400).json({ mensaje: "El correo ya está registrado" });
        }

        // Validar contraseña segura
        const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
        if (!regexPassword.test(password)) {
        return res.status(400).json({
            error: 'La contraseña debe tener al menos 8 caracteres, incluir una mayúscula, una minúscula y un número.'
        });
        }

        // Validar rol
        const rolesPermitidos = ['Gerencia', 'Ventas', 'Oficina Técnica', 'Almacén', 'Administración', 'Clientes'];
        if (!rolesPermitidos.includes(rol)) {
        return res.status(400).json({ error: 'Rol no permitido' });
        }

        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear usuario
        const nuevoUsuario = await db.usuarios.create({
            nombre, 
            email, 
            password: hashedPassword, 
            rol
        });

        res.status(201).json({ mensaje: "Usuario creado exitosamente", usuario: nuevoUsuario });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al registrar usuario" });
    }
};

// 🔹 Modificar datos completos del usuario
exports.actualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, email, rol } = req.body;

        const usuario = await db.usuarios.findByPk(id);
       
        // Validación de campos vacíos
        if (!nombre || !email || !rol) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        // Validar formato de nombre
        const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/;
        if (!regexNombre.test(nombre)) {
        return res.status(400).json({ error: 'Nombre solo debe contener letras' });
        }

        // Validar formato de correo
        if (!/\S+@\S+\.\S+/.test(email)) {
            return res.status(400).json({ error: 'Formato de correo inválido' });
        }

        // Validar rol
        const rolesPermitidos = ['Gerencia', 'Ventas', 'Oficina Técnica', 'Almacén', 'Administración', 'Clientes'];
        if (!rolesPermitidos.includes(rol)) {
        return res.status(400).json({ error: 'Rol no permitido' });
        }

        // 🚀 Actualizar datos
        usuario.nombre = nombre || usuario.nombre;
        usuario.email = email || usuario.email;
        usuario.rol = rol || usuario.rol;

        await usuario.save();
        

        res.status(200).json({ mensaje: "Usuario actualizado correctamente", usuario });
    } catch (error) {
        console.error("❌ Error al actualizar usuario:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

// 🔹 Eliminar un usuario
exports.eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        const usuario = await db.usuarios.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        await usuario.destroy();
        res.status(200).json({ mensaje: "Usuario eliminado correctamente" });
    } catch (error) {
        console.error("❌ Error al eliminar usuario:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};
