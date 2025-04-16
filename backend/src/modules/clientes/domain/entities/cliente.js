class Cliente { 
    constructor(razon_social, tipo, ruc, dni, telefono, email, domicilio_fiscal, representante_legal, dni_representante, creado_por) {
        this.razon_social = razon_social;
        this.tipo = tipo;
        this.ruc = ruc;
        this.dni = dni;
        this.telefono = telefono;
        this.email = email;
        this.domicilio_fiscal = domicilio_fiscal;
        this.representante_legal = representante_legal;
        this.dni_representante = dni_representante;
        this.creado_por = creado_por;
    }
}

module.exports = Cliente; // Exportamos la clase Cliente para su uso en otros módulos