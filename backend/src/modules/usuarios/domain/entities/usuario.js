class Usuario { 
    constructor(nombre, email, password, rol) {
        this.nombre = nombre;
        this.email = email;
        this.password = password;
        this.rol = rol;
    }
}

module.exports = Usuario; // Exportamos la clase Usuario para su uso en otros módulos