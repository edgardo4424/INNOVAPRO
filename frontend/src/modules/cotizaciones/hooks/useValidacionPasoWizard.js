import validarCotizacion from "../validaciones/validarCotizacion";

// Este hook permite validar el paso actual del wizard de cotización.
// Recibe los datos del formulario y devuelve una función que valida el paso actual.

export const useValidacionPasoWizard = (formData) => {
  return (pasoActual) => validarCotizacion(pasoActual, formData);
};