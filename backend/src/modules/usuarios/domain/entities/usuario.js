class Usuario { 
    constructor(nombre, email, password, rol) {
        this.nombre = nombre;
        this.email = email;
        this.password = password;
        this.rol = rol;
        this.telefono = telefono;
    }

    static validar(datos, modo = "crear") {
        const { nombre, email, rol, password } = datos;

        if (modo === "crear") {
            if (!password) return "Ingresar password";

            const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
            if (!regexPassword.test(password)) {
                return "La contraseña debe tener al menos 8 caracteres, incluir una mayúscula, una minúscula y un número.";
            }
        }

        if (!nombre || !email || !rol) return "Todos los campos son obligatorios";   

        const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/;
        if (!regexNombre.test(nombre)) return "Nombre solo debe contener letras";

        const regexEmail = /\S+@\S+\.\S+/;
        if (!regexEmail.test(email)) return "Formato de correo inválido";

        const rolesPermitidos = [
            "Gerencia",
            "Ventas",
            "Oficina Técnica",
            "Almacén",
            "Administración",
            "Clientes",
        ];

        if (!rolesPermitidos.includes(rol)) return "Rol no permitido";

        return null; // Todo bien
    }

    static validarLogin ({ email, password, recaptchaToken }) {
        if (!email || !password || !recaptchaToken) {
          return "Todos los campos son obligatorios, incluyendo el reCAPTCHA";
        }
      
        const regexEmail = /\S+@\S+\.\S+/;
        if (!regexEmail.test(email)) {
          return "Formato de correo inválido";
        }
        
        return null; // Todo bien
      }
}

module.exports = Usuario; // Exportamos la clase Usuario para su uso en otros módulos