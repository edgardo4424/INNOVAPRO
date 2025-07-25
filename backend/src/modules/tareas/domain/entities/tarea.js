class Tarea {

  constructor({usuarioId, empresaProveedoraId, clienteId, obraId, ubicacion, tipoTarea, estado, detalles, fecha_creacion, asignadoA, motivoDevolucion, correccionComercial, contactoId, usoId, atributos_valor_zonas, cotizacionId}) {

    this.usuarioId = usuarioId;
    this.empresaProveedoraId = empresaProveedoraId;
    this.clienteId = clienteId;
    this.obraId = obraId;
    this.ubicacion = ubicacion;
    this.tipoTarea = tipoTarea;
    this.estado = estado;
    this.detalles = detalles;
    this.fecha_creacion = fecha_creacion;
    this.asignadoA = asignadoA;
    this.motivoDevolucion = motivoDevolucion;
    this.correccionComercial = correccionComercial;
    this.contactoId = contactoId;
    this.usoId = usoId;
    this.atributos_valor_zonas = atributos_valor_zonas;
    this.cotizacionId = cotizacionId;
  }

  static validarCamposObligatorios(datos, modo = "crear") {

    const camposValidos = ["usuarioId", "empresaProveedoraId", "clienteId", "obraId", "ubicacion", "tipoTarea", "estado", "detalles","fecha_creacion", "asignadoA", "motivoDevolucion", "correccionComercial", "contactoId", "usoId", "atributos_valor_zonas", "cotizacionId"];
    
    if (modo === "crear") {

      if (!datos.usuarioId || !datos.tipoTarea) {
        return "Los campos usuarioId, tipoTarea son obligatorios";
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
