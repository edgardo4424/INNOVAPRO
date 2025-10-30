import { createContext, useContext, useEffect, useState } from "react";
import filialesService from "../../facturacion/service/FilialesService";
import pedidosService from "../service/PedidosService";
import { toast } from "react-toastify";

const PedidosContext = createContext();

export function PedidosProvider({ children }) {
  const [filiales, setFiliales] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [listaComerciales, setListaComerciales] = useState([]); // 🆕 Lista de comerciales únicos
  const [loading, setLoading] = useState(false);

  // 📌 OBTENER TODAS LAS FILIALES
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

  // 📌 OBTENER TODOS LOS PASES DE PEDIDOS
  const ObtenerPasePedidos = async () => {
    try {
      setLoading(true);
      const { mensaje, pases_pedidos } =
        await pedidosService.obtenerPasePedidos();

      if (!pases_pedidos || pases_pedidos.length === 0) {
        setPedidos([]);
        setListaComerciales([]); // limpiar si no hay pedidos
        return;
      }

      setPedidos(pases_pedidos);

      // 🆕 Extraer comerciales únicos
      const comercialesUnicos = [
        ...new Set(
          pases_pedidos
            .map((p) => p.cm_Usuario)
            .filter((u) => u && u.trim() !== ""),
        ),
      ];

      setListaComerciales(comercialesUnicos);
    } catch (error) {
      console.error("Error al obtener pases de pedidos:", error);
      toast.error("No se pudieron obtener los pedidos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    ObtenerPasePedidos();
  }, []);

  return (
    <PedidosContext.Provider
      value={{
        filiales,
        setFiliales,
        pedidos,
        setPedidos,
        listaComerciales, // 🆕 exportamos comerciales
        loading,
        setLoading,
        ObtenerPasePedidos,
      }}
    >
      {children}
    </PedidosContext.Provider>
  );
}

export function usePedidos() {
  return useContext(PedidosContext);
}
