import { createContext, useContext, useEffect, useState } from "react";
import filialesService from "../service/FilialesService";

const BandejaContext = createContext();

export function BandejaProvider({ children }) {
  const [filiales, setFiliales] = useState([]);

  // ?? OBTENER TODAS LAS FILIALES

  useEffect(() => {
    const consultarFiliales = async () => {
      const data = await filialesService.ObtenerPiezas();
      if (data.length === 0) {
        toast.error("No se encontraron filiales");
        return;
      }
      setFiliales(data);
    };
    consultarFiliales();
  }, []);

  return (
    <BandejaContext.Provider value={{ filiales }}>
      {children}
    </BandejaContext.Provider>
  );
}

export function useBandeja() {
  return useContext(BandejaContext);
}
