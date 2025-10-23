import { useEffect, useState } from "react";
import {
  obtenerCondicionesPorContrato,
  marcarCondicionesCumplidas,
} from "../services/condicionesService";
import { toast } from "react-toastify";

export default function useCondicionesComercial(contratoId) {
  const [condicion, setCondicion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cumplidas, setCumplidas] = useState([]);

  useEffect(() => {
    async function fetch() {
      try {
        const data = await obtenerCondicionesPorContrato(contratoId);
        setCondicion(data);
        setCumplidas(data.condiciones_cumplidas || []);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [contratoId]);

  const toggleCondicion = (cond) => {
    setCumplidas((prev) =>
      prev.includes(cond)
        ? prev.filter((c) => c !== cond)
        : [...prev, cond]
    );
  };

  const guardar = async () => {
    try {
        const res = await marcarCondicionesCumplidas(contratoId, cumplidas);
        const dataActualizada = await obtenerCondicionesPorContrato(contratoId);
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