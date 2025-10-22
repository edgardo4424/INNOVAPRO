import { useEffect, useState } from "react";
import {
  obtenerCondicionesPorCotizacion,
  marcarCondicionesCumplidas,
} from "../services/condicionesService";
import { toast } from "react-toastify";

export default function useCondicionesComercial(cotizacionId) {
  const [condicion, setCondicion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cumplidas, setCumplidas] = useState([]);

  useEffect(() => {
    async function fetch() {
      try {
        const data = await obtenerCondicionesPorCotizacion(cotizacionId);
        setCondicion(data);
        setCumplidas(data.condiciones_cumplidas || []);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [cotizacionId]);

  const toggleCondicion = (cond) => {
    setCumplidas((prev) =>
      prev.includes(cond)
        ? prev.filter((c) => c !== cond)
        : [...prev, cond]
    );
  };

  const guardar = async () => {
    try {
        const res = await marcarCondicionesCumplidas(cotizacionId, cumplidas);
        const dataActualizada = await obtenerCondicionesPorCotizacion(cotizacionId);
        setCondicion(dataActualizada);
        setCumplidas(dataActualizada.condiciones_cumplidas || []);
        toast.success("Condiciones actualizadas correctamente");
        return true;
    } catch (error) {
        console.error("Error al guardar condiciones:", error);
        toast.error("No se pudieron guardar las condiciones");
        return false;
    }
  };

  return {
    loading,
    condicion,
    cumplidas,
    toggleCondicion,
    guardar,
  };
}