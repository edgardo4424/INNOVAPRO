class Usuario { 
    constructor(email, password, id_chat, trabajador_id) {
     
        this.email = email;
        this.password = password;
    
        this.id_chat = id_chat
        this.trabajador_id = trabajador_id
    }

    static validar(datos, modo = "crear") {
        const { email, password } = datos;

        if (modo === "crear") {
            if (!password) return "Ingresar password";

            const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
            if (!regexPassword.test(password)) {
                return "La contraseña debe tener al menos 8 caracteres, incluir una mayúscula, una minúscula y un número.";
            }
        }

        if (!email) return "Todos los campos son obligatorios";   

        const regexEmail = /\S+@\S+\.\S+/;
        if (!regexEmail.test(email)) return "Formato de correo inválido";

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