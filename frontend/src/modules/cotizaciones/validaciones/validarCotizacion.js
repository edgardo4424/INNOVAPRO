// INNOVA PRO+ v1.3.1

export default function validarCotizacion(paso, datos) {
  const errores = {};

  if (paso === 0) {
    if (!datos.contacto_id) errores.contacto_id = "Debes seleccionar un contacto.";
    if (!datos.cliente_id) errores.cliente_id = "Debes seleccionar un cliente.";
    if (!datos.obra_id) errores.obra_id = "Debes seleccionar una obra.";
    if (!datos.filial_id) errores.filial_id = "Debes seleccionar una filial.";
  }

  if (paso === 1) {
    if (!datos.uso_id) errores.uso_id = "Debes seleccionar el uso que deseas cotizar.";
    if (!datos.tipo_cotizacion) errores.tipo_cotizacion = "Debes seleccionar el tipo de cotización.";
    if (datos.tipo_cotizacion === "Alquiler" && (!datos.duracion_alquiler || isNaN(datos.duracion_alquiler))) {
    errores.duracion_alquiler = "Indica la duración del alquiler en días.";
  }
  }

  if (paso === 2) {
    const sinZonas = !datos.zonas || datos.zonas.length === 0;
    const zonasSinEquipos = datos.zonas?.some(z => !Array.isArray(z.atributos_formulario) || z.atributos_formulario.length === 0);

    if (sinZonas || zonasSinEquipos) {
      errores.atributos = "Cada zona debe tener al menos un equipo configurado.";
    }
  }

  if (paso === 4) {
    if (
      !datos.zonas ||
      datos.zonas.length === 0 ||
      datos.zonas.some(z => !Array.isArray(z.atributos_formulario) || z.atributos_formulario.length === 0)
    ) {
      errores.atributos = "Cada zona debe tener al menos un equipo configurado.";
    }
  }

  return errores;
}