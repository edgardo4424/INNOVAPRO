import validarPasoConfirmacion from "./validarPasoConfirmacion";

// Este archivo define las reglas de validación dinámica para cada paso del wizard de cotización.
// Recibe dos argumentos: 
// paso: número entero que indica en qué parte del wizard estamos 
// datos: el formData completo con todos los valores acumulados 
// Y devuelve un objeto errores con los campos que no cumplen las condiciones requeridas.

export default function validarCotizacion(paso, datos) {
  const errores = {};
  const entidad = datos.entidad;
  const uso = datos.uso;
  const cotizacion = datos.cotizacion;

  if (paso === 0) { // Paso Contacto
    if (!entidad.contacto.id) errores.contacto_id = "Debes seleccionar un contacto.";
    if (!entidad.cliente.id) errores.cliente_id = "Debes seleccionar un cliente.";
    if (!entidad.obra.id) errores.obra_id = "Debes seleccionar una obra.";
    if (!entidad.filial.id) errores.filial_id = "Debes seleccionar una filial.";
  }

  if (paso === 1) { // Paso USOS
    if (!uso.id) errores.uso_id = "Debes seleccionar el uso que deseas cotizar.";
    if (!cotizacion.tipo) errores.tipo_cotizacion = "Debes seleccionar el tipo de cotización.";
    if (cotizacion.tipo === "Alquiler" && (!cotizacion.duracion_alquiler || isNaN(cotizacion.duracion_alquiler))) {
    errores.duracion_alquiler = "Indica la duración del alquiler en días.";
  }
  }

  if (paso === 2) { // Paso de Attributos
    const sinZonas = !uso.zonas || uso.zonas.length === 0;
    const zonasSinEquipos = uso.zonas?.some(z => !Array.isArray(z.atributos_formulario) || z.atributos_formulario.length === 0);

    if (sinZonas || zonasSinEquipos) {
      errores.atributos = "Cada zona debe tener al menos un equipo configurado.";
    }
  }

  if (paso === 3) { // Paso de Confirmación
    // Aquí se delega la validación a validarPasoConfirmacion.js, 
    // que valida toda la lógica condicional del paso más importante de todos.
    Object.assign(errores, validarPasoConfirmacion(datos))
  }

  return errores;
}