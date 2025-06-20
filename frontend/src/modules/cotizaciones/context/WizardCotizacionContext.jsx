import { createContext, useContext, useState } from "react";
import formDataInicial from "../constants/formDataInicial";
import { useValidacionPasoWizard } from "../hooks/useValidacionPasoWizard";

// Este contexto maneja el estado del formulario del wizard de cotización.
// Permite compartir el estado del formulario y las funciones de validación entre los diferentes pasos del wizard.
// Proporciona un contexto para que los componentes hijos puedan acceder y modificar el estado del formulario
// y manejar la validación de los datos ingresados en cada paso.
// Utiliza useState para manejar el estado del formulario y los errores de validación.
// También define una función para validar el paso actual del formulario según las reglas de validación definidas en validarCotizacion.js.

// El objetivo es centralizar la lógica de manejo del estado del formulario y la validación, 
// permitiendo que los componentes de los pasos del wizard se enfoquen en la presentación y la interacción del usuario.

const WizardContext = createContext();

export const WizardProvider = ({ children }) => { 
  const [formData, setFormData] = useState(formDataInicial); // Inicializamos el estado del formulario con los datos iniciales definidos en formDataInicial.js

  const [errores, setErrores] = useState({}); 

  const validarPaso = useValidacionPasoWizard(formData); // Usamos el hook de validación para obtener la función que valida el paso actual del formulario

  const resetFormData = () => {
    setFormData(formDataInicial); // Resetea el estado del formulario a los datos iniciales
    setErrores({}); // Limpia los errores de validación
  }

  return (
    <WizardContext.Provider
      value={{
        formData,
        setFormData,
        errores,
        setErrores,
        validarPaso,
        resetFormData,
      }}
    >
      {children}
    </WizardContext.Provider>
  );
};

export const useWizardContext = () => useContext(WizardContext);