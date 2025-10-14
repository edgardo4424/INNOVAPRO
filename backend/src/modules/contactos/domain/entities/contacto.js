class Contacto {
  constructor(nombre, email, telefono, cargo/* , clientes, obras */) {
    this.nombre = nombre;
    this.email = email;
    this.telefono = telefono;
    this.cargo = cargo;
   /*  this.clientes = clientes;
    this.obras = obras; */
  }

  static validarCamposObligatorios(datos, modo = "crear") {
    const camposValidos = ["nombre", "email", "telefono", "cargo"/* , "clientes", "obras" */];
    
    if (modo === "crear") {
      if (!datos.nombre || !datos.email) {
        return "Nombre y email son obligatorios";
      }
    }
    if (modo === "editar") {
      const tieneAlMenosUnCampoValido = camposValidos.some((campo) => {
        return (
          datos[campo] !== undefined &&
          datos[campo] !== null &&
          datos[campo] !== ""
        );
      });

      if (!tieneAlMenosUnCampoValido) {
        return "Debe proporcionar al menos un campo válido para actualizar.";
      }
    }

    return null;
  }

  static construirDatosContacto(datos) {
    const base = {
        nombre: datos?.nombre,
        email: datos?.email,
        telefono: datos?.telefono,
        cargo: datos?.cargo,
        clientesIds: datos?.clientes_asociados,
        obrasIds: datos?.obras_asociadas
    }

    return base; // Retorna los datos del cliente según el tipo de entidad
}
}

module.exports = Contacto; // Exportamos la clase Cliente para su uso en otros módulos
