class Filial { 
    constructor(representante_legal, dni_representante, cargo_representante, telefono_representante, telefono_oficina, creado_por) {
        this.representante_legal = representante_legal;
        this.dni_representante = dni_representante;
        this.cargo_representante = cargo_representante;
        this.telefono_representante = telefono_representante;
        this.telefono_oficina = telefono_oficina;
        this.creado_por = creado_por;
    }
}

module.exports = Filial; // Exportamos la clase filial para su uso en otros módulos