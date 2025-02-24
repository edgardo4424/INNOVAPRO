const db = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const axios = require("axios");

// 🔹 Login de usuario
exports.login = async (req, res) => {
    try {
        const { email, password, recaptchaToken } = req.body;
        console.log("📩 Recibido en backend:", req.body);

        if (!email || !password || !recaptchaToken){
            return res.status(400).json({ mensaje: "❌ Todos los campos son obligatorios, incluyendo reCAPTCHA."});
        }

        // 🔹 Verificar reCAPTCHA con Google
        const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY;
        const recaptchaResponse = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify`,
            null,
            {
                params: {
                    secret: recaptchaSecretKey,
                    response: recaptchaToken
                }
            }
        );

        if (!recaptchaResponse.data.success) {
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

        // Verificar si el correo ya está en uso
        const usuarioExistente = await db.usuarios.findOne({ where: { email } });
        if (usuarioExistente) {
            return res.status(400).json({ mensaje: "El correo ya está registrado" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const nuevoUsuario = await db.usuarios.create({
            nombre, email, password: hashedPassword, rol
        });

        res.status(201).json({ mensaje: "Usuario creado exitosamente", usuario: nuevoUsuario });
    } catch (error) {
        console.error("❌ Error al crear usuario:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

// 🔹 Modificar el rol de un usuario
exports.modificarRolUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { rol } = req.body;

        const usuario = await db.usuarios.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        usuario.rol = rol;
        await usuario.save();

        res.status(200).json({ mensaje: "Rol actualizado correctamente", usuario });
    } catch (error) {
        console.error("❌ Error al modificar rol:", error);
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
