import { createContext, useContext, useEffect, useState } from "react";
import filialesService from "../service/FilialesService";
import facturaService from "../service/FacturaService";
import { toast } from "react-toastify";

const BandejaContext = createContext();

export function BandejaProvider({ children }) {
  const [filiales, setFiliales] = useState([]);
  const [documentosPendientes, setDocumentosPendientes] = useState([]);
  const [totalPendientes, setTotalPendientes] = useState(0);

  const serieFactura = [
    { value: "FT01", tipo: "01", descrip: "fatura" },
    { value: "FT02", tipo: "01", descrip: "fatura" },
    { value: "FT03", tipo: "01", descrip: "fatura" },
    { value: "FT04", tipo: "01", descrip: "fatura" },
    { value: "BT01", tipo: "03", descrip: "boleta" },
    { value: "BT02", tipo: "03", descrip: "boleta" },
    { value: "BT03", tipo: "03", descrip: "boleta" },
    { value: "BT04", tipo: "03", descrip: "boleta" },
  ];

  const serieGuia = [{ value: "T005", tipo: "09", descrip: "guia" }];

  const serieNota = [
    { value: "FCT1", tipo: "07", descrip: "nota Credito" },
    { value: "FCT2", tipo: "07", descrip: "nota Credito" },
    { value: "BCT1", tipo: "07", descrip: "nota Credito" },
    { value: "BCT2", tipo: "07", descrip: "nota Credito" },
    { value: "FDT1", tipo: "08", descrip: "nota Debito" },
    { value: "FDT2", tipo: "08", descrip: "nota Debito" },
    { value: "BDT1", tipo: "08", descrip: "nota Debito" },
    { value: "BDT2", tipo: "08", descrip: "nota Debito" },
  ];

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
        serieFactura,
        serieGuia,
        serieNota,
      }}
    >
      {children}
    </BandejaContext.Provider>
  );
}

export function useBandeja() {
  return useContext(BandejaContext);
}
