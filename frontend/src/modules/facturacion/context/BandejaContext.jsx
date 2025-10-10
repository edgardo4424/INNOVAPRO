import { createContext, useContext, useEffect, useState } from "react";
import filialesService from "../service/FilialesService";
import facturaService from "../service/FacturaService";
import { toast } from "react-toastify";

const BandejaContext = createContext();

export function BandejaProvider({ children }) {
  const [filiales, setFiliales] = useState([]);
  const [documentosPendientes, setDocumentosPendientes] = useState([]);
  const [totalPendientes, setTotalPendientes] = useState(0);

  // ?? OBTENER TODAS LAS FILIALES

  useEffect(() => {
    const consultarFiliales = async () => {
      try {
        const data = await filialesService.ObtenerPiezas();
        if (data.length === 0) {
          toast.error("No se encontraron filiales");
          return;
        }
        setFiliales(data);
      } catch (error) {
        console.error("Error al consultar filiales:", error);
        toast.error("Ocurrió un error al obtener las filiales");
      }
    };
    consultarFiliales();
  }, []);

  const consultaPendientes = async () => {
    try {
      const { data, total, message } = await facturaService.obtenerPendientes();
      if (data.length > 0) {
        // toast.warn(`Tienes ${total} documentos pendientes`);
        setDocumentosPendientes(data);
        setTotalPendientes(total);
        return;
      }
      setDocumentosPendientes([]);
      setTotalPendientes(0);
    } catch (error) {}
  };

  useEffect(() => {
    if (!documentosPendientes.length) {
      consultaPendientes();
    }
  }, []);

  return (
    <BandejaContext.Provider
      value={{
        filiales,
        consultaPendientes,
        documentosPendientes,
        totalPendientes,
      }}
    >
      {children}
    </BandejaContext.Provider>
  );
}

export function useBandeja() {
  return useContext(BandejaContext);
}
