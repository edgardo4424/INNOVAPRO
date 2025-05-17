// INNOVA PRO+ v1.2.0
import { createContext, useContext, useState } from "react";
import validarCotizacion from "../validaciones/validarCotizacion";

const WizardContext = createContext();

export const WizardProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    cliente: "",
    obra: "",
    contacto: "",
    uso_id: "",
    atributos: {},
    despiece: [],
    descuento: 0,
    requiereAprobacion: false,
  });

  const [errores, setErrores] = useState({});

  const validarPaso = (pasoActual) => {
    return validarCotizacion(pasoActual, formData);
  };

  return (
    <WizardContext.Provider
      value={{
        formData,
        setFormData,
        errores,
        setErrores,
        validarPaso,
      }}
    >
      {children}
    </WizardContext.Provider>
  );
};

export const useWizardContext = () => useContext(WizardContext);

export default useWizardContext;