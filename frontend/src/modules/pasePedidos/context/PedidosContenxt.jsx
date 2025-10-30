import { createContext, useContext, useEffect, useState } from "react";
import filialesService from "../../facturacion/service/FilialesService";
import pedidosService from "../service/PedidosService";

const PedidosContenxt = createContext();

export function PedidosProvider({ children }) {
  const [filiales, setFiliales] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const ObtenerPasePedidos = async () => {
    try {
      setLoading(true);
      const { mensaje, pases_pedidos } =
        await pedidosService.obtenerPasePedidos();
      if (pases_pedidos.length === 0) {
        setPedidos([]);
      } else {
        setPedidos(pases_pedidos);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    ObtenerPasePedidos();
  }, []);

  return (
    <PedidosContenxt.Provider
      value={{
        filiales,
        setFiliales,
        pedidos,
        setPedidos,
        loading,
        setLoading,
        ObtenerPasePedidos,
      }}
    >
      {children}
    </PedidosContenxt.Provider>
  );
}

export function usePedidos() {
  return useContext(PedidosContenxt);
}
