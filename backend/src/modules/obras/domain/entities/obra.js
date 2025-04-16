class Obra { 
    constructor(nombre, ubicacion, direccion, estado, creado_por, fecha_creacion, fecha_actualizacion) {
        this.nombre = nombre;
        this.ubicacion = ubicacion;
        this.direccion = direccion;
        this.estado = estado;
        this.creado_por = creado_por;
        this.fecha_creacion = fecha_creacion;
        this.fecha_actualizacion = fecha_actualizacion
    }
}

module.exports = Obra; // Exportamos la clase Obra para su uso en otros módulos