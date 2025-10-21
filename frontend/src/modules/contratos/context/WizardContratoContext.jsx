// librerías de contextos de react
import { createContext, useContext, useState } from "react";
// objeto del formData inicial para el flujo de contrato
import formDataInicialContrato from "../constants/formDataInicialContrato";
// hook que maneja las validaciones en cada paso
import { useValidacionPasoContrato } from "../hooks/useValidacionPasoContrato";

/**
 * Contexto central del Wizard de CONTRATOS.
 * - Un contrato nace de una cotización y HEREDA toda su data.
 * - Este contexto guarda el formData del contrato (incluye la cotización origen)
 *   y expone validaciones por paso específicas de contratos.
 */

const WizardContratoContext = createContext(); 

export const WizardContratoProvider = ({ children }) => {
  // Estado principal del wizard de contrato
  const [formData, setFormData] = useState(formDataInicialContrato);
  const [errores, setErrores] = useState({});
  const [pasoActual, setPasoActual] = useState(1);

  // Validador por paso (reglas para contratos)
  const validarPaso = useValidacionPasoContrato(formData);

  // Reset completo del wizard
  const resetFormData = () => {
    setFormData(formDataInicialContrato);
    setErrores({});
    setPasoActual(1);
  };

  return (
    <WizardContratoContext.Provider
      value={{
        formData,          // Objeto completo del contrato (con cotización origen)
        setFormData,       // Setter reactivo
        errores,           // Mapa de errores por campo
        setErrores,        // Setter de errores
        validarPaso,       // Función: (paso) => errores
        pasoActual,
        setPasoActual,
        resetFormData,     // Limpia el wizard
      }}
    >
      {children}
    </WizardContratoContext.Provider>
  );
};

// Hook de consumo del contexto
export const useWizardContratoContext = () => useContext(WizardContratoContext);