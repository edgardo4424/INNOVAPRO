import validarContratoPorPaso from "../validaciones/validarContratoPorPaso";

/**
 * Hook de validación por paso del Wizard de CONTRATOS.
 * Recibe el formData del contrato (incluyendo la cotización origen)
 * y retorna una función que valida el paso actual.
 */
export const useValidacionPasoContrato = (formData) => {
  return (pasoActual) => validarContratoPorPaso(pasoActual, formData);
};