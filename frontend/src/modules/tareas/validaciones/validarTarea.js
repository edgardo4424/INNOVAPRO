// src/utils/validaciones/validarTarea.js

export function validarTarea(formData) {
  const errores = {
    formData: {},
    detalles: {},
  };

  // Validaciones generales
  if (!formData.contactoId) errores.formData.contactoId = "Seleccione un contacto";
  if (!formData.clienteId) errores.formData.clienteId = "Seleccione un cliente";
  if (!formData.obraId) errores.formData.obraId = "Seleccione una obra";
  if (!formData.empresaProveedoraId) errores.formData.empresaProveedoraId = "Seleccione una filial";
  if (!formData.tipoTarea) errores.formData.tipoTarea = "Seleccione el tipo de tarea";

  // Validaciones específicas para Apoyo Técnico con Despiece
  const despiece = formData.tipoTarea === "Apoyo Técnico" && formData.detalles?.apoyoTecnico?.includes("Despiece");

  if (despiece) {
    if (!formData.usoId || formData.usoId === "") {
      errores.formData.usoId = "Seleccione el uso de equipo";
    }


    if (!formData.zonas || formData.zonas.length === 0) {
      errores.formData.zonas = "Debe agregar al menos una zona con equipos";
    } else {
      formData.zonas.forEach((zona, index) => {
        if (!zona.atributos_formulario || zona.atributos_formulario.length === 0) {
          errores.formData[`zona${index}`] = `La zona ${index + 1} no tiene equipos asignados`;
        }
      });
    }

    if (!formData.detalles?.tipo_cotizacion || formData.detalles.tipo_cotizacion === "")

    if (formData.detalles.tipo_cotizacion === "Alquiler" &&
      (!formData.detalles.dias_alquiler || isNaN(formData.detalles.dias_alquiler))
    ) {
      errores.detalles.dias_alquiler = "Ingrese los días de alquiler";
    }

  }

  return errores;
}