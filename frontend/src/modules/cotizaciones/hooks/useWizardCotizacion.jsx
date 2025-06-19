// INNOVA PRO+ v1.2.0
import { createContext, useContext, useState } from "react";
import validarCotizacion from "../validaciones/validarCotizacion";

const WizardContext = createContext();

export const WizardProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    contacto_id: "",
    contacto_nombre: "",

    cliente_id: "",
    cliente_nombre: "",

    obra_id: "",
    obra_nombre: "",
    obra_direccion: "",
    obra_ubicacion: "",

    filial_id: "",
    filial_nombre: "",
    
    uso_id: null,
    tipo_cotizacion: "Alquiler",

    zonas: [],
    despiece: [],
    descuento: 0,
    requiereAprobacion: false,

    tiene_transporte: "",
    tipo_transporte: "",
    costo_tarifas_transporte: 0,
    costo_distrito_transporte: 0,
    costo_pernocte_transporte: 0,

    tiene_instalacion: undefined,
    tipo_instalacion: "",
    precio_instalacion_completa: 0,
    precio_instalacion_parcial: 0,
    nota_instalacion: "",

    tiene_pernos_disponibles: false,
    tiene_pernos: undefined,
    duracion_alquiler: 0,
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