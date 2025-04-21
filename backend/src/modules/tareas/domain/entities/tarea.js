class Tarea {
  constructor({usuarioId, empresaProveedoraId, clienteId, obraId, ubicacion, tipoTarea, urgencia, estado, detalles, fecha_creacion, asignadoA, motivoDevolucion, correccionComercial}) {
    this.usuarioId = usuarioId;
    this.empresaProveedoraId = empresaProveedoraId;
    this.clienteId = clienteId;
    this.obraId = obraId;
    this.ubicacion = ubicacion;
    this.tipoTarea = tipoTarea;
    this.urgencia = urgencia;
    this.estado = estado;
    this.detalles = detalles;
    this.fecha_creacion = fecha_creacion;
    this.asignadoA = asignadoA;
    this.motivoDevolucion = motivoDevolucion;
    this.correccionComercial = correccionComercial;
  }

  static validarCamposObligatorios(datos, modo = "crear") {
    const camposValidos = ["usuarioId", "empresaProveedoraId", "clienteId", "obraId", "tipoTarea", "urgencia", "estado", "detalles","fecha_creacion", "asignadoA", "motivoDevolucion", "correccionComercial"];
    
    if (modo === "crear") {

      console.log(datos);

      if (!datos.usuarioId || !datos.empresaProveedoraId || !datos.clienteId || !datos.obraId || !datos.tipoTarea || !datos.urgencia) {
        return "Todos los campos son obligatorios.";
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

 
}

module.exports = Tarea; // Exportamos la clase Tarea para su uso en otros módulos
