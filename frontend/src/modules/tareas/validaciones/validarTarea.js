export function validarTarea(tarea, tipoTarea) {
    const errores = {};
  
    if (!tarea.empresaProveedoraId) {
      errores.empresaProveedoraId = "Debes seleccionar una filial";
    }
  
    if (!tarea.clienteId) {
      errores.clienteId = "Debes seleccionar un cliente";
    }
  
    if (!tarea.obraId) {
      errores.obraId = "Debes seleccionar una obra";
    }
  
    if (!tarea.urgencia) {
      errores.urgencia = "Debes seleccionar el nivel de urgencia";
    }
  
    if (!tipoTarea) {
      errores.tipoTarea = "Debes seleccionar el tipo de tarea";
    }
  
    if (tipoTarea === "Apoyo Técnico" && !tarea.detalles.apoyoTecnico) {
      errores.apoyoTecnico = "Debes seleccionar el tipo de apoyo técnico";
    }
  
    if (tipoTarea === "Apoyo Administrativo" && !tarea.detalles.apoyoAdministrativo) {
      errores.apoyoAdministrativo = "Debes seleccionar el tipo de apoyo administrativo";
    }
  
    if (tipoTarea === "Servicios Adicionales" && !tarea.detalles.tipoServicio) {
      errores.tipoServicio = "Debes indicar el tipo de servicio";
    }
  
    if (tipoTarea === "Pase de Pedido") {
      if (!tarea.detalles.estadoPasePedido) {
        errores.estadoPasePedido = "Debes seleccionar el estado del pedido";
      }
      if (!tarea.detalles.numeroVersionContrato) {
        errores.numeroVersionContrato = "Debes indicar el número de contrato";
      }
      if (!tarea.detalles.fechaEntrega) {
        errores.fechaEntrega = "Debes seleccionar la fecha de entrega";
      }
      if (!tarea.detalles.horaEntrega) {
        errores.horaEntrega = "Debes seleccionar la hora de entrega";
      }
    }
  
    return errores;
  }  